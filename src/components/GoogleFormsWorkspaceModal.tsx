import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/agencyConfig';
import {
  clearAccessToken,
  getAccessToken,
  googleSignIn,
  initAuth,
  logout,
} from '../services/googleAuth';
import {
  createWebsitePreviewForm,
  getGoogleFormDetails,
  getGoogleFormResponses,
  listGoogleForms,
  type DriveFormFile,
  type GoogleFormDetails,
  type GoogleFormResponseRow,
} from '../services/googleFormsApi';

interface GoogleFormsWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFormUrl: string;
  activeFormId: string;
  onSetActiveForm: (formUrl: string, formId: string) => void;
  onClearActiveForm: () => void;
}

interface ServerLead {
  id: string;
  submittedAt: string;
  fullName: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  country: string;
  businessWebsite: string;
  websiteType: string;
  requirements: string;
  whatsappStatus?: 'sent' | 'not_configured' | 'failed';
  whatsappProvider?: string;
}

function GoogleSignInButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-3 rounded-full border border-[#747775]/40 bg-white px-5 py-2.5 text-sm font-medium text-[#1F1F1F] shadow-xs hover:bg-[#F8F9FA] hover:shadow-sm active:bg-[#EEEEEE] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF] focus-visible:ring-offset-2"
    >
      <span className="h-5 w-5 shrink-0" aria-hidden="true">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="block h-full w-full"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </span>
      <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>
  );
}

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function GoogleFormsWorkspaceModal({
  isOpen,
  onClose,
  activeFormUrl,
  activeFormId,
  onSetActiveForm,
  onClearActiveForm,
}: GoogleFormsWorkspaceModalProps) {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [formsList, setFormsList] = useState<DriveFormFile[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [creatingForm, setCreatingForm] = useState(false);

  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId);
  const [formDetails, setFormDetails] = useState<GoogleFormDetails | null>(null);
  const [responses, setResponses] = useState<GoogleFormResponseRow[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const [activeTab, setActiveTab] = useState<'leads' | 'forms'>('leads');
  const [serverLeads, setServerLeads] = useState<ServerLead[]>([]);
  const [loadingServerLeads, setLoadingServerLeads] = useState(false);
  const [whatsappConfigured, setWhatsappConfigured] = useState(false);
  const [whatsappProvider, setWhatsappProvider] = useState('none');
  const [whatsappRecipient, setWhatsappRecipient] = useState('+918910964232');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const loadServerLeads = useCallback(async (tokenOverride?: string) => {
    const token = tokenOverride ?? getAccessToken();
    if (!token) return;
    setLoadingServerLeads(true);
    try {
      const res = await fetch('/api/leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        leads?: ServerLead[];
        configured?: boolean;
        provider?: string;
        recipientNumber?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        if (data?.error) setErrorMsg(data.error);
        return;
      }
      setServerLeads(data.leads ?? []);
      setWhatsappConfigured(Boolean(data.configured));
      setWhatsappProvider(data.provider ?? 'none');
      setWhatsappRecipient(data.recipientNumber ?? '+918910964232');
    } catch {
      // Non-fatal: keep Google Forms workspace usable even if leads endpoint fails
    } finally {
      setLoadingServerLeads(false);
    }
  }, []);

  const loadSelectedForm = useCallback(
    async (formId: string, tokenOverride?: string) => {
      const token = tokenOverride ?? getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
      setLoadingResponses(true);
      setErrorMsg(null);
      try {
        const [details, respRows] = await Promise.all([
          getGoogleFormDetails(token, formId),
          getGoogleFormResponses(token, formId),
        ]);
        setSelectedFormId(details.formId);
        setFormDetails(details);
        setResponses(respRows);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load form details.';
        setErrorMsg(message);
        if (message.toLowerCase().includes('auth') || message.includes('401')) {
          clearAccessToken();
          setNeedsAuth(true);
        }
      } finally {
        setLoadingResponses(false);
      }
    },
    []
  );

  const loadFormsFromDrive = useCallback(
    async (tokenOverride?: string) => {
      const token = tokenOverride ?? getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }
      setLoadingForms(true);
      setErrorMsg(null);
      try {
        const files = await listGoogleForms(token);
        setFormsList(files);
        const targetId = activeFormId || files[0]?.id || '';
        if (targetId) {
          await loadSelectedForm(targetId, token);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to fetch Google Forms.';
        setErrorMsg(message);
        if (message.toLowerCase().includes('auth') || message.includes('401')) {
          clearAccessToken();
          setNeedsAuth(true);
        }
      } finally {
        setLoadingForms(false);
      }
    },
    [activeFormId, loadSelectedForm]
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setNeedsAuth(false);
        if (isOpen) {
          void loadFormsFromDrive(token);
          void loadServerLeads(token);
        }
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return unsubscribe;
  }, [isOpen, loadFormsFromDrive, loadServerLeads]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();

    if (!needsAuth && getAccessToken()) {
      void loadFormsFromDrive();
      void loadServerLeads();
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, needsAuth, onClose, loadFormsFromDrive, loadServerLeads]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
      await Promise.all([
        loadFormsFromDrive(result.accessToken),
        loadServerLeads(result.accessToken),
      ]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Google sign-in was cancelled or failed.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setFormsList([]);
    setFormDetails(null);
    setResponses([]);
  };

  const handleCreatePreviewForm = async () => {
    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setCreatingForm(true);
    setErrorMsg(null);
    try {
      const created = await createWebsitePreviewForm(token);
      setFormDetails(created);
      setSelectedFormId(created.formId);
      setResponses([]);
      onSetActiveForm(created.responderUri, created.formId);
      const files = await listGoogleForms(token);
      setFormsList(files);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to create Google Form.'
      );
    } finally {
      setCreatingForm(false);
    }
  };

  const handleCopyFormUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const handleExportCsv = () => {
    if (!formDetails || responses.length === 0) return;

    const headers = [
      'Submitted At',
      ...formDetails.questions.map((q) => q.title),
    ];

    const rows = responses.map((resp) => [
      new Date(resp.lastSubmittedTime || resp.createTime).toLocaleString(),
      ...formDetails.questions.map((q) => resp.answersByQuestionId[q.questionId] || ''),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webtron-leads-${formDetails.formId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportServerLeadsCsv = () => {
    if (serverLeads.length === 0) return;

    const headers = [
      'Submitted At',
      'Full Name',
      'Business Name',
      'Country',
      'Business Email',
      'Phone / WhatsApp',
      'Website Type',
      'Current Website',
      'Requirements',
      'WhatsApp Dispatch',
    ];

    const rows = serverLeads.map((lead) => [
      new Date(lead.submittedAt).toLocaleString(),
      lead.fullName,
      lead.businessName,
      lead.country,
      lead.businessEmail,
      lead.phone,
      lead.websiteType,
      lead.businessWebsite || '',
      lead.requirements,
      lead.whatsappStatus || 'not_configured',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'webtron-server-leads.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildLeadWhatsAppSummary = (lead: ServerLead) =>
    [
      'Website Preview Request:',
      `Name: ${lead.fullName}`,
      `Business: ${lead.businessName} (${lead.country})`,
      `Email: ${lead.businessEmail}`,
      `Phone / WhatsApp: ${lead.phone}`,
      `Website Type: ${lead.websiteType}`,
      lead.businessWebsite ? `Current Website: ${lead.businessWebsite}` : null,
      `Requirements: ${lead.requirements}`,
    ]
      .filter(Boolean)
      .join('\n');

  const isSelectedFormActive =
    Boolean(formDetails?.responderUri) &&
    activeFormUrl === formDetails?.responderUri;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-forms-workspace-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[#171717]/65 backdrop-blur-xs"
      />

      {/* Modal Surface */}
      <div className="relative z-10 flex h-[100dvh] sm:h-auto sm:max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-none sm:rounded-2xl sm:border sm:border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold text-[#455CFF] uppercase tracking-wide">
              Google Workspace Integration
            </p>
            <h2
              id="google-forms-workspace-title"
              className="mt-0.5 sm:mt-1 font-display text-lg sm:text-2xl font-bold tracking-tight text-[#171717]"
            >
              Google Forms &amp; Lead Responses
            </h2>
            <p className="mt-1 hidden sm:block text-sm text-[#6B7280]">
              Connect a Google Form to capture visitor preview requests and view submitted
              responses directly from your Google Drive.
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close Google Forms Workspace"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-[#171717] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CFF]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
          {/* Active Landing Page Form Status */}
          <div className="rounded-xl border border-slate-200 bg-[#F8F8F5] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#171717]">
                {activeFormUrl
                  ? 'Landing Page Preview Form: Connected to Google Forms'
                  : 'Landing Page Preview Form: Using Built-in 8-Field Form'}
              </p>
              {activeFormUrl && (
                <p className="mt-0.5 text-xs font-mono text-[#6B7280] truncate max-w-xl">
                  {activeFormUrl}
                </p>
              )}
            </div>

            {activeFormUrl && (
              <div className="flex items-center gap-2 shrink-0">
                {!confirmDisconnect ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDisconnect(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
                    <span>Disconnect Form</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
                    <span className="text-xs font-medium text-red-800">
                      Revert landing modal to built-in form?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClearActiveForm();
                        setConfirmDisconnect(false);
                      }}
                      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDisconnect(false)}
                      className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700"
            >
              {errorMsg}
            </div>
          )}

          {needsAuth ? (
            <div className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#455CFF]">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-display text-lg font-bold text-[#171717]">
                  Connect Your Google Account
                </h3>
                <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
                  Sign in with Google to create a custom Website Preview Request Form in your
                  Drive, attach an existing form, and inspect submitted client leads.
                </p>
              </div>
              <div className="pt-2">
                <GoogleSignInButton
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  loading={isLoggingIn}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Signed-in Account Bar + Primary Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google account avatar'}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-[#EEF1FF] text-[#455CFF] font-bold text-xs flex items-center justify-center">
                      {(user?.displayName || user?.email || 'G')[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#171717] truncate">
                      {user?.displayName || 'Connected Google Account'}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCreatePreviewForm}
                    disabled={creatingForm}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#455CFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2E43E6] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {creatingForm ? 'Creating Form...' : 'Create 8-Field Preview Form'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void loadFormsFromDrive()}
                    disabled={loadingForms}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#171717] hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${loadingForms ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    <span>Refresh Forms</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Owner Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-[#171717] text-white'
                      : 'border border-slate-200 bg-white text-[#171717] hover:bg-slate-50'
                  }`}
                >
                  Saved Website Leads ({serverLeads.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('forms')}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'forms'
                      ? 'bg-[#171717] text-white'
                      : 'border border-slate-200 bg-white text-[#171717] hover:bg-slate-50'
                  }`}
                >
                  Google Forms ({formsList.length})
                </button>
              </div>

              {activeTab === 'leads' ? (
                <div className="space-y-4">
                  <div
                    className={`rounded-xl border px-4 py-3.5 text-xs leading-relaxed ${
                      whatsappConfigured
                        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                        : 'border-amber-200 bg-amber-50/70 text-amber-950'
                    }`}
                  >
                    <p className="font-semibold">
                      {whatsappConfigured
                        ? `Silent WhatsApp Automation Active (${whatsappProvider}) → ${whatsappRecipient}`
                        : `Silent WhatsApp Delivery Not Activated Yet (Target: ${whatsappRecipient})`}
                    </p>
                    <p className="mt-1">
                      {whatsappConfigured
                        ? 'Every new submission from the built-in form is saved in .local-data/leads.json and automatically pushed to your WhatsApp.'
                        : 'Submissions from the built-in form are currently saved in .local-data/leads.json on your server (shown below). To automatically push every submission to WhatsApp without the visitor doing anything, add WHATSAPP_WEBHOOK_URL (Make/Zapier/n8n/Pabbly), WHATSAPP_CALLMEBOT_APIKEY, Meta WhatsApp Cloud API, or Twilio secrets in AI Studio Secrets.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-[#171717]">
                      Leads Stored in Server (.local-data/leads.json)
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void loadServerLeads()}
                        disabled={loadingServerLeads}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#171717] hover:bg-slate-50 cursor-pointer disabled:opacity-60"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${loadingServerLeads ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                        <span>Refresh</span>
                      </button>

                      {serverLeads.length > 0 && (
                        <button
                          type="button"
                          onClick={handleExportServerLeadsCsv}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#171717] hover:bg-slate-50 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Export CSV</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {loadingServerLeads ? (
                    <div className="rounded-xl border border-slate-200 p-6 text-center text-xs text-[#6B7280]">
                      Loading saved leads...
                    </div>
                  ) : serverLeads.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs sm:text-sm text-[#6B7280]">
                      No leads saved in .local-data/leads.json yet. Submit the built-in preview form on the
                      landing page and click Refresh.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-[#F8F8F5] text-[#171717]">
                          <tr>
                            <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                              Submitted
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                              Client &amp; Business
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                              Contact
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                              Project Brief
                            </th>
                            <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                              WhatsApp
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {serverLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/70 align-top">
                              <td className="px-3.5 py-3 font-mono text-[11px] text-[#6B7280] whitespace-nowrap tabular-nums">
                                {new Date(lead.submittedAt).toLocaleString()}
                              </td>
                              <td className="px-3.5 py-3 text-[#171717]">
                                <p className="font-semibold">{lead.fullName}</p>
                                <p className="text-[#6B7280]">
                                  {lead.businessName} ({lead.country})
                                </p>
                              </td>
                              <td className="px-3.5 py-3 text-[#171717]">
                                <p>{lead.phone}</p>
                                <p className="text-[#6B7280]">{lead.businessEmail}</p>
                              </td>
                              <td className="px-3.5 py-3 text-[#171717] max-w-[240px]">
                                <p className="font-medium text-[#455CFF]">{lead.websiteType}</p>
                                <p className="mt-0.5 text-[#6B7280] break-words">
                                  {lead.requirements}
                                </p>
                              </td>
                              <td className="px-3.5 py-3 whitespace-nowrap space-y-1.5">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                    lead.whatsappStatus === 'sent'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {lead.whatsappStatus === 'sent'
                                    ? 'Auto-sent'
                                    : 'Pending secret'}
                                </span>
                                <div>
                                  <a
                                    href={getWhatsAppUrl(buildLeadWhatsAppSummary(lead))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] hover:underline"
                                  >
                                    <MessageCircle className="h-3 w-3" aria-hidden="true" />
                                    <span>Open in WhatsApp</span>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                /* Drive Form Selector + Selected Form Details */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Google Forms in Drive */}
                <div className="lg:col-span-4 space-y-2.5">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    Your Google Forms ({formsList.length})
                  </h3>

                  {loadingForms ? (
                    <div className="rounded-xl border border-slate-200 p-4 text-xs text-[#6B7280]">
                      Loading Google Forms from Drive...
                    </div>
                  ) : formsList.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-[#FAFAFA] p-4 text-xs text-[#6B7280] leading-relaxed">
                      No Google Forms found yet. Click &ldquo;Create 8-Field Preview Form&rdquo;
                      above to generate one automatically.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                      {formsList.map((file) => {
                        const isSelected = file.id === selectedFormId;
                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => void loadSelectedForm(file.id)}
                            className={`w-full text-left rounded-xl border p-3 transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-[#455CFF] bg-[#EEF1FF]/50'
                                : 'border-slate-200 bg-white hover:border-[#455CFF]/40'
                            }`}
                          >
                            <p className="font-display text-xs font-bold text-[#171717] line-clamp-2">
                              {file.name}
                            </p>
                            {file.modifiedTime && (
                              <p className="mt-1 text-[11px] font-mono text-[#6B7280]">
                                Updated {new Date(file.modifiedTime).toLocaleDateString()}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: Selected Form Controls & Live Responses */}
                <div className="lg:col-span-8 space-y-4">
                  {loadingResponses ? (
                    <div className="rounded-2xl border border-slate-200 p-8 text-center text-sm text-[#6B7280]">
                      Loading form structure and responses...
                    </div>
                  ) : formDetails ? (
                    <>
                      <div className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-4 sm:p-5 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-base font-bold text-[#171717]">
                              {formDetails.title}
                            </h3>
                            <p className="mt-0.5 text-xs font-mono text-[#6B7280] truncate max-w-md">
                              {formDetails.responderUri}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onSetActiveForm(formDetails.responderUri, formDetails.formId)
                              }
                              disabled={isSelectedFormActive}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                                isSelectedFormActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                  : 'bg-[#171717] text-white hover:bg-[#455CFF] cursor-pointer'
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>
                                {isSelectedFormActive
                                  ? 'Active on Landing Page'
                                  : 'Use This Form on Landing Page'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleCopyFormUrl(formDetails.responderUri)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#171717] hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                            >
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
                            </button>

                            <a
                              href={formDetails.responderUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#455CFF] hover:bg-slate-50 whitespace-nowrap"
                            >
                              <span>Open Form</span>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Responses Header & Table */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-display text-sm font-bold text-[#171717]">
                            Submitted Responses ({responses.length})
                          </h4>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void loadSelectedForm(formDetails.formId)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#171717] hover:bg-slate-50 cursor-pointer"
                            >
                              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Refresh</span>
                            </button>

                            {responses.length > 0 && (
                              <button
                                type="button"
                                onClick={handleExportCsv}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#171717] hover:bg-slate-50 cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Export CSV</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {responses.length === 0 ? (
                          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs sm:text-sm text-[#6B7280]">
                            No responses submitted to this form yet. Once visitors submit through
                            your form, every response will appear here automatically.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                              <thead className="bg-[#F8F8F5] text-[#171717]">
                                <tr>
                                  <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                                    Submitted
                                  </th>
                                  {formDetails.questions.map((q) => (
                                    <th
                                      key={q.questionId}
                                      className="px-3.5 py-2.5 font-semibold whitespace-nowrap"
                                    >
                                      {q.title}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {responses.map((resp) => (
                                  <tr key={resp.responseId} className="hover:bg-slate-50/70">
                                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-[#6B7280] whitespace-nowrap tabular-nums">
                                      {new Date(
                                        resp.lastSubmittedTime || resp.createTime
                                      ).toLocaleString()}
                                    </td>
                                    {formDetails.questions.map((q) => (
                                      <td
                                        key={q.questionId}
                                        className="px-3.5 py-2.5 text-[#171717] max-w-[220px] break-words"
                                      >
                                        {resp.answersByQuestionId[q.questionId] || '—'}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-8 text-center text-sm text-[#6B7280]">
                      Select a Google Form on the left or create a new 8-field Preview Request
                      Form to inspect fields and responses.
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
