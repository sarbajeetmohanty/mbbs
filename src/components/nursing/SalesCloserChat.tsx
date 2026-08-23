import { useEffect, useRef, useState } from "react";
import { X, Send, Zap, CheckCheck, Volume2, VolumeX, Sparkles } from "lucide-react";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

type Message = {
  id: string;
  sender: "agent" | "user";
  text: string;
  time: string;
  cta?: {
    label: string;
    action: () => void;
  };
};

function playWhatsAppChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    // Tone 1: 850Hz to 1100Hz chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(850, now);
    osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Tone 2: 1250Hz to 1450Hz soft bell
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1250, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(1450, now + 0.16);
    gain2.gain.setValueAtTime(0.18, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.25);
  } catch {
    /* ignore autoplay restrictions */
  }
}

const quickQuestions = [
  "💊 Is Pharmacology & Drug Calculation included?",
  "🩺 Will this help in NORCET, AIIMS & CHO exams?",
  "📥 How soon do I get the PDF after payment?",
  "🖨️ Can I print these notes on physical paper?",
  "🎁 Are Med-Surg flashcards & ECGs included?",
];

const answers: Record<string, string> = {
  "💊 Is Pharmacology & Drug Calculation included?":
    "Yes! Pharmacology is covered in depth across pages 351–426 with high-yield drug tables, mechanisms, side effects, and exact drug dosage calculation formulas (pp. 427–431).",
  "🩺 Will this help in NORCET, AIIMS & CHO exams?":
    "100% yes. The 600+ pages are distilled specifically for competitive exams like NORCET (AIIMS), ESIC, State CHO, RRB, and GNM/B.Sc semester revisions with illustrated diagrams and mnemonics.",
  "📥 How soon do I get the PDF after payment?":
    "Instantly! The moment your payment succeeds, your personal PDF download link and payment receipt are automatically sent to your Email & WhatsApp without any waiting.",
  "🖨️ Can I print these notes on physical paper?":
    "Yes! You receive a clean high-resolution digital PDF that you can read on your phone, iPad, or laptop, and you are 100% free to print physical copies for offline paper study.",
  "🎁 Are Med-Surg flashcards & ECGs included?":
    "Yes! Med-Surg Flashcards (pp. 234–280) and 25+ ECG/EKG rhythm interpretations (pp. 319–344) are included directly inside the single PDF file.",
};

export function SalesCloserChat({ onOpenCheckout }: { onOpenCheckout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreviewBubble, setShowPreviewBubble] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: "Namaste! 👋 I am Dr. Sneha from Nursing Notes support. Need any quick help with the 600+ page syllabus or instant download?",
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  // Trigger preview bubble and chime after scrolling or after 5 seconds
  useEffect(() => {
    const triggerBubble = () => {
      if (hasTriggeredRef.current || isOpen) return;
      hasTriggeredRef.current = true;
      setShowPreviewBubble(true);
      if (soundEnabled) {
        playWhatsAppChime();
      }
    };

    // Scroll trigger (after 450px)
    const onScroll = () => {
      if (window.scrollY > 450) {
        triggerBubble();
      }
    };

    // Time trigger (after 6 seconds)
    const timer = setTimeout(triggerBubble, 6000);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen, soundEnabled]);

  useEffect(() => {
    if (isOpen) {
      setShowPreviewBubble(false);
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const sendQuestion = (q: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: q,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (soundEnabled) {
        playWhatsAppChime();
      }
      const replyText =
        answers[q] ||
        "Thank you for asking! The Complete Nursing Notes covers all 23 core medical topics in 600+ illustrated pages with instant delivery at ₹199. Would you like to get your copy now?";

      const agentReply: Message = {
        id: String(Date.now() + 1),
        sender: "agent",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cta: {
          label: "Get Instant Access — ₹199",
          action: onOpenCheckout,
        },
      };

      setMessages((prev) => [...prev, agentReply]);
    }, 800);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue("");
    sendQuestion(text);
  };

  return (
    <>
      {/* Auto-Triggered Floating Preview Bubble */}
      {showPreviewBubble && !isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp live chat notification"
          className="fixed bottom-36 right-4 z-50 max-w-[17rem] sm:bottom-22 sm:right-6 animate-rise"
        >
          <div
            onClick={() => {
              setShowPreviewBubble(false);
              setIsOpen(true);
            }}
            className="relative flex cursor-pointer items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-card p-3 shadow-float ring-1 ring-emerald-500/20 backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreviewBubble(false);
              }}
              aria-label="Dismiss message preview"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-[10px] text-background hover:bg-foreground"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Avatar */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-soft">
              <WhatsAppIcon className="h-5 w-5 fill-white" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Dr. Sneha (Support)</span>
                <span className="text-[0.6rem] text-muted-foreground">Just now</span>
              </div>
              <p className="mt-0.5 text-[0.72rem] leading-snug text-muted-foreground">
                👋 Need help with the 600+ page syllabus or download link?
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[0.65rem] font-bold text-[#128C7E]">
                <span>Tap to chat on WhatsApp</span> →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => {
            setShowPreviewBubble(false);
            setIsOpen((prev) => !prev);
          }}
          aria-label="Open WhatsApp support chat"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/40 hover:bg-[#20ba5a]"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <WhatsAppIcon className="h-7 w-7 fill-white" />
          )}

          {/* Unread badge & green pulse */}
          {!isOpen && hasUnread && (
            <>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
                  1
                </span>
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </>
          )}
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <aside
          aria-label="Nursing Notes WhatsApp Support Chat"
          className="fixed bottom-36 right-4 z-50 w-[calc(100vw-2rem)] max-w-[22rem] overflow-hidden rounded-3xl border border-border bg-[#ECE5DD]/20 shadow-float backdrop-blur-md ring-1 ring-border sm:bottom-22 sm:right-6 animate-rise"
        >
          {/* WhatsApp Header */}
          <div className="flex items-center justify-between bg-[#075E54] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#128C7E] text-white">
                <WhatsAppIcon className="h-5 w-5 fill-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-[#075E54] bg-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight flex items-center gap-1">
                  <span>Nursing Notes Support</span>
                  <span className="rounded-full bg-emerald-400 px-1 py-0.2 text-[0.55rem] font-bold text-[#075E54]">
                    VERIFIED
                  </span>
                </p>
                <p className="text-[0.65rem] text-emerald-100 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online · Instant replies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={soundEnabled ? "Mute notification sound" : "Enable notification sound"}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 opacity-60" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex max-h-80 min-h-[14rem] flex-col gap-2.5 overflow-y-auto bg-[#efeae2] p-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-[#dcf8c6] text-slate-900 rounded-br-none"
                      : "bg-white text-slate-900 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.cta && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        m.cta?.action();
                      }}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[0.7rem] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-95 cursor-pointer"
                    >
                      <Zap className="h-3 w-3 fill-gold text-gold" />
                      <span>{m.cta.label}</span>
                    </button>
                  )}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[0.6rem] text-slate-500">
                    <span>{m.time}</span>
                    {m.sender === "user" && <CheckCheck className="h-3 w-3 text-sky-600" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-[0.7rem] text-slate-600 shadow-sm w-fit">
                <span className="animate-pulse">Dr. Sneha is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Pills */}
          <div className="border-t border-border/80 bg-white/95 p-2.5">
            <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Quick Questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendQuestion(q)}
                  className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-medium text-slate-800 transition hover:border-[#128C7E] hover:bg-emerald-50 active:scale-95 cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleCustomSend} className="flex items-center gap-2 border-t border-border bg-white p-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#128C7E]/40"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#128C7E] text-white shadow-sm transition hover:bg-[#075E54] cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
