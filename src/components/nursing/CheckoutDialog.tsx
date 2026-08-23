import { useEffect, useState } from "react";
import { X, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Countdown } from "./Countdown";
import { PaymentBadges } from "./PaymentBadges";

type Props = {
  open: boolean;
  onClose: () => void;
  price?: number;
};

const ORIGINAL = 4999;

export function CheckoutDialog({ open, onClose, price = 199 }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/45 px-3 py-4 sm:items-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Complete your purchase"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-float ring-1 ring-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">Complete your purchase</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Instant download link sent to your Email & WhatsApp.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-blush/60 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Offer ends in
          </p>
          <div className="mt-2">
            <Countdown />
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5 text-center">
            <p className="font-display text-xl">You're almost in 🎉</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order is reserved at ₹{price}. We'll email the payment link and download access
              to <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="co-email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="co-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
              />
              <p className="mt-1 text-xs text-muted-foreground">Notes will be sent here.</p>
            </div>
            <div>
              <label htmlFor="co-phone" className="text-sm font-medium">
                WhatsApp number
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded-xl border border-input bg-secondary px-3 py-3 text-sm">
                  +91
                </span>
                <input
                  id="co-phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit number"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Complete Nursing Notes Bundle</span>
                <span className="text-muted-foreground line-through">₹{ORIGINAL}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-medium">Total payable</span>
                <span className="font-display text-2xl text-primary">₹{price}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                You save ₹{ORIGINAL - price} ({Math.round((1 - price / ORIGINAL) * 100)}% off)
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Proceed to payment • ₹{price}</span>
            </button>
            <PaymentBadges className="mt-2" />
          </form>
        )}
      </div>
    </div>
  );
}
