import { useEffect } from "react";
import { X } from "lucide-react";

export type LegalTopic = "privacy" | "refund" | "terms" | "contact" | "about";

const content: Record<LegalTopic, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "We only collect the details needed to deliver your purchase — your name, email address and WhatsApp number. These are used solely to send you the notes, your payment receipt and any free updates you are entitled to.",
      "We never sell, rent or share your personal information with third parties for marketing. Payment details are processed securely by our payment partner and are never stored on our servers.",
      "You can ask us to view or delete your data at any time by writing to us through the contact details on this page.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      "All sales are final. Because the notes are a digital product delivered instantly to your email and WhatsApp, we do not offer refunds, returns or cancellations once your order is placed.",
      "Please go through the sample pages and the complete topic list on this page before buying, so you know exactly what you are getting.",
      "If you ever face an issue accessing or downloading your purchase, write to us and we will fix it — including resending your links manually.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "The nursing notes bundle is a digital product delivered as a PDF via email and WhatsApp after a one-time payment. Your purchase includes lifetime access and all future updates free of cost.",
      "The notes are licensed for your personal study use only. Reselling, redistributing or uploading the files publicly is not permitted.",
      "Prices and launch offers may change once the countdown ends. The price you pay at checkout is final for your order.",
    ],
  },
  contact: {
    title: "Contact Us",
    body: [
      "Need help with your order, a missing email, or anything else? We reply within a few hours.",
      "Email us at support@nursingnotes.in or message us on WhatsApp with your order details and we will sort it out — including resending your download links manually if needed.",
      "Support hours: 9 AM – 9 PM IST, all days.",
    ],
  },
  about: {
    title: "About Us",
    body: [
      "Nursing Notes was started by nursing educators who watched talented students struggle not because they didn't study, but because their material was never organised for revision.",
      "We compress the entire GNM, BSc and NORCET syllabus into clean, handwritten-style pages — short lines, labelled diagrams, mnemonics and exam-focused tables — so you can revise a full subject in a single sitting.",
      "Over 2,400 students across India revise with our notes today.",
    ],
  },
};

type Props = { topic: LegalTopic | null; onClose: () => void };

export function LegalDialog({ topic, onClose }: Props) {
  useEffect(() => {
    if (!topic) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [topic, onClose]);

  if (!topic) return null;
  const { title, body } = content[topic];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-7 shadow-float ring-1 ring-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-blush hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {body.map((p) => (
            <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
