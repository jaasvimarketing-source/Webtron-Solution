import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ExternalLink, Send, X } from 'lucide-react';
import { AGENCY_CONFIG, WHATSAPP_CONFIG, getWhatsAppUrl } from '../config/agencyConfig';
import { trackEvent } from '../utils/privacyAnalytics';

interface WhatsAppChatbotProps {
  onOpenPreviewModal: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'open_preview' | 'open_work';
}

const QUICK_PROMPTS = [
  'Get my free 15-min preview',
  'Custom business website',
  'E-commerce online store',
  'Website redesign or SEO',
] as const;

function getCurrentTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function WhatsAppLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.002 2.667C8.64 2.667 2.669 8.637 2.669 16c0 2.353.615 4.65 1.784 6.676L2.667 29.333l6.817-1.787A13.28 13.28 0 0 0 16.002 29.333C23.364 29.333 29.335 23.363 29.335 16S23.364 2.667 16.002 2.667Zm7.785 18.87c-.328.922-1.916 1.763-2.648 1.874-.672.101-1.522.144-2.456-.154-.568-.18-1.298-.421-2.231-.824-3.924-1.694-6.487-5.647-6.683-5.908-.196-.261-1.594-2.121-1.594-4.046 0-1.925 1.008-2.87 1.366-3.262.358-.391.781-.489 1.042-.489.261 0 .521.003.749.014.24.012.562-.091.88.672.326.783 1.108 2.707 1.206 2.903.098.196.163.424.033.685-.13.261-.196.424-.391.652-.196.228-.412.51-.587.685-.196.195-.4.407-.172.799.228.391 1.015 1.674 2.18 2.712 1.498 1.335 2.761 1.749 3.152 1.944.391.196.619.163.847-.098.228-.261.977-1.14 1.238-1.531.261-.391.521-.326.88-.196.358.13 2.281 1.076 2.672 1.271.391.196.652.294.749.457.098.163.098.945-.23 1.867Z" />
    </svg>
  );
}

function buildBotReply(input: string): Omit<ChatMessage, 'id' | 'sender' | 'time'> {
  const normalized = input.toLowerCase();

  if (
    normalized.includes('preview') ||
    normalized.includes('15') ||
    normalized.includes('free') ||
    normalized.includes('start')
  ) {
    return {
      text: `You can get a FREE working website preview from ${AGENCY_CONFIG.name} in just 15 minutes with zero upfront commitment. Click below to submit your business details, or continue directly on WhatsApp.`,
      action: 'open_preview',
    };
  }

  if (
    normalized.includes('ecom') ||
    normalized.includes('e-commerce') ||
    normalized.includes('shop') ||
    normalized.includes('store')
  ) {
    return {
      text: 'We build high-converting e-commerce online stores tailored for US & UK businesses. Share your product type via our Preview Form and we will prepare a working store preview in 15 minutes.',
      action: 'open_preview',
    };
  }

  if (normalized.includes('redesign') || normalized.includes('outdated')) {
    return {
      text: 'We specialize in transforming outdated websites into modern, fast, conversion-focused digital experiences. Share your existing website link and we will build a fresh working preview in 15 minutes.',
      action: 'open_preview',
    };
  }

  if (normalized.includes('seo') || normalized.includes('google') || normalized.includes('rank')) {
    return {
      text: 'Our primary focus is custom web development, backed by clean technical SEO & growth foundations so US and UK customers can discover your business online.',
      action: 'open_preview',
    };
  }

  if (
    normalized.includes('work') ||
    normalized.includes('portfolio') ||
    normalized.includes('example')
  ) {
    return {
      text: 'We have built live websites including ZEDesign Interiors (UK), Model Bridge USA (NYC), Timy in Sicily, and On-Site Electronics (USA). You can inspect every live project in our portfolio section.',
      action: 'open_work',
    };
  }

  if (
    normalized.includes('price') ||
    normalized.includes('cost') ||
    normalized.includes('quote') ||
    normalized.includes('budget')
  ) {
    return {
      text: 'First, we build your working website preview for free within 15 minutes so you can see our quality before deciding. Once you approve the direction, we share a clear project scope and quote.',
      action: 'open_preview',
    };
  }

  return {
    text: `Thanks for reaching out to ${AGENCY_CONFIG.name}. Tell us a bit about your business—or request your free 15-minute working website preview—and our team can continue with you directly on WhatsApp.`,
    action: 'open_preview',
  };
}

export function WhatsAppChatbot({ onOpenPreviewModal }: WhatsAppChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hi there! Welcome to ${AGENCY_CONFIG.name}. Want to see a FREE working website preview for your business within 15 minutes?`,
      time: getCurrentTimeLabel(),
    },
  ]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = (text: string, inputMethod: 'quick_prompt' | 'custom_input') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    trackEvent('whatsapp_chatbot_message_sent', { inputMethod });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: getCurrentTimeLabel(),
    };

    const replyData = buildBotReply(trimmed);
    const botMessage: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      time: getCurrentTimeLabel(),
      ...replyData,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(inputValue, 'custom_input');
  };

  const latestUserMessage = [...messages].reverse().find((msg) => msg.sender === 'user')?.text;
  const whatsappHandoffMessage = latestUserMessage
    ? `Hi ${AGENCY_CONFIG.name}, I was chatting on your website regarding: "${latestUserMessage}". I would like to discuss getting a website developed for my business.`
    : WHATSAPP_CONFIG.defaultMessage;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <section
          aria-label={`${AGENCY_CONFIG.name} WhatsApp Chatbot`}
          className="mb-3 flex w-[calc(100vw-2rem)] sm:w-[370px] max-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-12px_rgba(11,15,23,0.28)]"
        >
          {/* WhatsApp Header */}
          <div className="flex items-center justify-between gap-3 bg-[#075E54] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppLogo className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight truncate">
                  {AGENCY_CONFIG.name}
                </p>
                <p className="text-[11px] text-white/80 truncate">
                  WhatsApp Assistant · 15-Min Preview
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chatbot"
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-[#EFEAE2] px-3.5 py-4 space-y-3 min-h-[240px] max-h-[300px]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    message.sender === 'user'
                      ? 'bg-[#D9FDD3] text-[#0B0F17] rounded-tr-xs'
                      : 'bg-white text-[#0B0F17] rounded-tl-xs border border-black/5'
                  }`}
                >
                  <p>{message.text}</p>

                  {message.action === 'open_preview' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenPreviewModal();
                      }}
                      data-analytics-event="cta_preview_click"
                      data-analytics-location="whatsapp_chatbot"
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#455CFF] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2E43E6] transition-colors cursor-pointer"
                    >
                      <span>Get My Free Website Preview</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}

                  {message.action === 'open_work' && (
                    <a
                      href="#portfolio"
                      onClick={() => setIsOpen(false)}
                      data-analytics-event="nav_link_click"
                      data-analytics-location="whatsapp_chatbot"
                      data-analytics-label="View Previous Work"
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black transition-colors"
                    >
                      <span>View Previous Work</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}

                  <span className="mt-1 block text-right font-mono text-[10px] text-slate-400 tabular-nums">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Topic Buttons */}
          <div className="border-t border-slate-200 bg-white px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt, 'quick_prompt')}
                className="rounded-lg border border-slate-200 bg-[#FAFAFA] px-2.5 py-1.5 text-[11px] font-medium text-[#0B0F17] hover:border-[#075E54] hover:bg-emerald-50/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar + Direct WhatsApp Handoff */}
          <div className="border-t border-slate-200 bg-white p-3 space-y-2.5">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <label htmlFor="whatsapp-chatbot-input" className="sr-only">
                Type your message
              </label>
              <input
                id="whatsapp-chatbot-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your website..."
                className="flex-1 rounded-xl border border-slate-200 bg-[#FAFAFA] px-3.5 py-2 text-xs sm:text-sm text-[#0B0F17] placeholder:text-slate-400 focus:border-[#075E54] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075E54]/15"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!inputValue.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#075E54] text-white hover:bg-[#064E46] disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <a
              href={getWhatsAppUrl(whatsappHandoffMessage)}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="cta_whatsapp_click"
              data-analytics-location="whatsapp_chatbot"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-[#073B1A] hover:bg-[#20BD5A] transition-colors whitespace-nowrap"
            >
              <WhatsAppLogo className="h-4 w-4" />
              <span>Continue Chat on WhatsApp ({WHATSAPP_CONFIG.displayNumber})</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      )}

      {/* Floating WhatsApp Logo Launcher */}
      <button
        type="button"
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          trackEvent('whatsapp_chatbot_toggle', { expanded: nextOpen });
        }}
        aria-label={isOpen ? 'Close WhatsApp chatbot' : 'Open WhatsApp chatbot'}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-4px_rgba(37,211,102,0.55)] hover:bg-[#1EBE5D] active:scale-[0.97] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E54] focus-visible:ring-offset-2"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <WhatsAppLogo className="h-8 w-8" />}
      </button>
    </div>
  );
}
