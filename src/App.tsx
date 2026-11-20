import { Suspense, lazy, useState } from 'react';
import { ClientSuccessStoriesSection } from './components/ClientSuccessStoriesSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Navbar } from './components/Navbar';
import { PortfolioSection } from './components/PortfolioSection';
import { PreviewRequestModal } from './components/PreviewRequestModal';
import { ServicesSection } from './components/ServicesSection';
import { WhatsAppChatbot } from './components/WhatsAppChatbot';
import { GOOGLE_FORM_CONFIG } from './config/agencyConfig';

const GoogleFormsWorkspaceModal = lazy(() =>
  import('./components/GoogleFormsWorkspaceModal').then((module) => ({
    default: module.GoogleFormsWorkspaceModal,
  }))
);

const ACTIVE_FORM_URL_KEY = 'webtron_active_google_form_url';
const ACTIVE_FORM_ID_KEY = 'webtron_active_google_form_id';

function readStoredString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormsWorkspaceOpen, setIsFormsWorkspaceOpen] = useState(false);
  const [activeGoogleFormUrl, setActiveGoogleFormUrl] = useState(() =>
    readStoredString(ACTIVE_FORM_URL_KEY, GOOGLE_FORM_CONFIG.formUrl)
  );
  const [activeGoogleFormId, setActiveGoogleFormId] = useState(() =>
    readStoredString(ACTIVE_FORM_ID_KEY, '')
  );

  const handleOpenPreview = () => {
    setIsModalOpen(true);
  };

  const handleSetActiveForm = (formUrl: string, formId: string) => {
    setActiveGoogleFormUrl(formUrl);
    setActiveGoogleFormId(formId);
    try {
      window.localStorage.setItem(ACTIVE_FORM_URL_KEY, formUrl);
      window.localStorage.setItem(ACTIVE_FORM_ID_KEY, formId);
    } catch {
      // Ignore storage errors
    }
  };

  const handleClearActiveForm = () => {
    setActiveGoogleFormUrl('');
    setActiveGoogleFormId('');
    try {
      window.localStorage.removeItem(ACTIVE_FORM_URL_KEY);
      window.localStorage.removeItem(ACTIVE_FORM_ID_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F5] text-[#171717]">
      <Navbar onOpenPreviewModal={handleOpenPreview} />

      <main className="flex-1">
        <HeroSection onOpenPreviewModal={handleOpenPreview} />
        <ServicesSection onOpenPreviewModal={handleOpenPreview} />
        <PortfolioSection />
        <ClientSuccessStoriesSection />
        <HowItWorksSection />
        <FaqSection onOpenPreviewModal={handleOpenPreview} />
        <FinalCtaSection onOpenPreviewModal={handleOpenPreview} />
      </main>

      <Footer onOpenFormsWorkspace={() => setIsFormsWorkspaceOpen(true)} />

      <PreviewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeGoogleFormUrl={activeGoogleFormUrl}
      />

      {isFormsWorkspaceOpen && (
        <Suspense fallback={null}>
          <GoogleFormsWorkspaceModal
            isOpen={isFormsWorkspaceOpen}
            onClose={() => setIsFormsWorkspaceOpen(false)}
            activeFormUrl={activeGoogleFormUrl}
            activeFormId={activeGoogleFormId}
            onSetActiveForm={handleSetActiveForm}
            onClearActiveForm={handleClearActiveForm}
          />
        </Suspense>
      )}

      <WhatsAppChatbot onOpenPreviewModal={handleOpenPreview} />
    </div>
  );
}
