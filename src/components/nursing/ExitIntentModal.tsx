import { useEffect, useState } from "react";
import { X, Zap, ShieldCheck, Check, Sparkles, Clock } from "lucide-react";
import { WhatsAppIcon } from "./SalesCloserChat";

type Props = {
  onClaimDiscount: () => void;
  originalPrice?: number;
  regularPrice?: number;
  discountPrice?: number;
};

export function ExitIntentModal({
  onClaimDiscount,
  originalPrice = 4999,
  regularPrice = 199,
  discountPrice = 149,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hasShown = false;

    // Desktop: detect mouse leaving top window edge
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasShown) {
        hasShown = true;
        setIsOpen(true);
      }
    };

    // Mobile: back button popstate trap
    try {
      window.history.pushState({ modalTrap: true }, "", window.location.href);
    } catch {}

    const handlePopState = () => {
      if (!hasShown) {
        hasShown = true;
        try {
          window.history.pushState({ modalTrap: true }, "", window.location.href);
        } catch {}
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Special exit discount offer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card p-6 shadow-float ring-1 ring-border sm:p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close special offer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition hover:bg-blush hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Urgency Ribbon */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-destructive">
          <Sparkles className="h-3 w-3 fill-current text-destructive" />
          Wait! One-Time Student Grant
        </div>

        <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-foreground">
          Take an Extra ₹50 Off!
        </h3>

        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
          We want every nursing student to succeed. Get the entire 600+ page notebook for just:
        </p>

        {/* Price Card */}
        <div className="mt-4 rounded-2xl border border-primary/20 bg-blush/40 p-4">
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-display text-4xl font-bold text-primary sm:text-5xl">
              ₹{discountPrice}
            </span>
            <span className="text-base text-muted-foreground line-through sm:text-lg">
              ₹{regularPrice}
            </span>
            <span className="text-xs text-muted-foreground line-through opacity-60">
              ₹{originalPrice}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Special grant expires in:{" "}
              <span className="font-mono font-bold tabular-nums">
                {pad(minutes)}:{pad(seconds)}
              </span>
            </span>
          </div>
        </div>

        {/* Benefits Checklist */}
        <ul className="mt-4 space-y-1.5 text-left text-xs text-foreground/85">
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Complete 23 core medical subjects & 600+ pages</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Instant PDF link delivered to your Email & WhatsApp</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Lifetime access & free future syllabus updates</span>
          </li>
        </ul>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onClaimDiscount();
          }}
          className="animate-soft-pulse mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Zap className="h-4 w-4 fill-current text-gold" />
          <span>Claim ₹{discountPrice} Offer Now</span>
        </button>

        {/* Secondary WhatsApp question option */}
        <a
          href="https://wa.me/?text=Hi%20Nursing%20Notes%20Team%2C%20I%20have%20a%20question%20about%20the%20600%2B%20Page%20Nursing%20Notes%20Bundle.%20Please%20guide%20me!"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#128C7E] hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4 fill-[#25D366]" />
          <span>Have a question? Chat with support on WhatsApp</span>
        </a>

        <p className="mt-2 text-[0.65rem] text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span>Instant Download · 100% Verified Notes · No Recurring Fees</span>
        </p>
      </div>
    </div>
  );
}
