import { useEffect, useState } from "react";

const TOTAL_SECONDS = 30 * 60;
const STORAGE_KEY = "nn-offer-deadline";

function readDeadline() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const value = Number(raw);
      if (Number.isFinite(value) && value > Date.now()) return value;
    }
    const next = Date.now() + TOTAL_SECONDS * 1000;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return Date.now() + TOTAL_SECONDS * 1000;
  }
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

/** Returns remaining time in the 30-minute offer window. */
export function useOfferCountdown() {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const deadline = readDeadline();
    if (!deadline) return;

    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return { remaining, hours, minutes, seconds, label: `${pad(minutes)}:${pad(seconds)}` };
}

type Props = { variant?: "inline" | "boxed" };

export function Countdown({ variant = "boxed" }: Props) {
  const { hours, minutes, seconds } = useOfferCountdown();

  if (variant === "inline") {
    return (
      <span className="font-sans font-semibold tabular-nums tracking-tight">
        {pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  const blocks = [
    { value: pad(hours), unit: "HOURS" },
    { value: pad(minutes), unit: "MINUTES" },
    { value: pad(seconds), unit: "SECONDS" },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {blocks.map((block, i) => (
        <div key={block.unit} className="flex items-center gap-2">
          {i > 0 && <span className="pb-3 text-xl font-semibold text-primary/40">:</span>}
          <div className="flex w-16 flex-col items-center rounded-xl bg-primary px-2 py-2 text-primary-foreground shadow-card sm:w-[4.5rem]">
            <span className="text-2xl font-semibold tabular-nums leading-none">{block.value}</span>
            <span className="mt-1 text-[0.55rem] font-medium tracking-[0.12em] text-primary-foreground/70">
              {block.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
