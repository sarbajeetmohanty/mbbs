import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, X } from "lucide-react";

type Buyer = {
  name: string;
  city: string;
  exam: string;
  timeAgo: string;
};

const nursingBuyers: Buyer[] = [
  { name: "Pooja Sharma", city: "New Delhi", exam: "NORCET 7 Prep", timeAgo: "1 min ago" },
  { name: "Dr. Sneha Patil", city: "Mumbai", exam: "Clinical Revision", timeAgo: "Just now" },
  { name: "Ananya Nair", city: "Kochi", exam: "B.Sc Nursing 3rd Year", timeAgo: "3 mins ago" },
  { name: "Rohan Deshmukh", city: "Pune", exam: "ESIC Nurse Staff", timeAgo: "2 mins ago" },
  { name: "Kavita Meena", city: "Jaipur", exam: "State CHO & AIIMS", timeAgo: "Just now" },
  { name: "Amrit Sinha", city: "Patna", exam: "GNM Nursing Exams", timeAgo: "4 mins ago" },
  { name: "Divya Reddy", city: "Hyderabad", exam: "NORCET Aspirant", timeAgo: "2 mins ago" },
  { name: "Suresh Choudhary", city: "Jodhpur", exam: "Medical-Surgical Revision", timeAgo: "5 mins ago" },
  { name: "Monika Das", city: "Kolkata", exam: "Pharmacology & ECG", timeAgo: "1 min ago" },
  { name: "Neha Verma", city: "Lucknow", exam: "B.Sc Final Sem", timeAgo: "Just now" },
  { name: "Harpreet Kaur", city: "Chandigarh", exam: "NCLEX & NORCET", timeAgo: "3 mins ago" },
  { name: "Priyanka Joshi", city: "Ahmedabad", exam: "Nursing Officer Exam", timeAgo: "2 mins ago" },
];

export function PurchasePopup() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let hideTimer: ReturnType<typeof setTimeout>;

    const showNext = () => {
      setCurrentIdx((prev) => (prev + 1) % nursingBuyers.length);
      setVisible(true);

      hideTimer = setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // First popup after 3.5s, then every 12s
    const initialTimer = setTimeout(showNext, 3500);
    const intervalTimer = setInterval(showNext, 13000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(intervalTimer);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const buyer = nursingBuyers[currentIdx]!;

  return (
    <aside
      aria-label="Recent purchase notification"
      className="fixed bottom-20 left-3 z-40 max-w-[17rem] sm:max-w-[20rem] transition-all duration-300 ease-out sm:bottom-6 sm:left-6 animate-rise"
    >
      <div className="relative flex items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 p-3 shadow-float backdrop-blur-md ring-1 ring-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close notification"
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-[10px] font-bold text-background transition hover:bg-foreground hover:scale-110 cursor-pointer shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Avatar with initial */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush font-display text-sm font-bold text-primary shadow-soft">
          {buyer.name.charAt(0)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1">
            <span className="truncate text-xs font-bold text-foreground">{buyer.name}</span>
            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
            <span className="text-[0.65rem] text-muted-foreground">({buyer.city})</span>
          </div>

          <p className="truncate text-[0.7rem] text-muted-foreground">
            Purchased <span className="font-semibold text-foreground">Nursing Notes (600+ pgs)</span>
          </p>

          <div className="mt-0.5 flex items-center justify-between text-[0.65rem]">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <Sparkles className="h-2.5 w-2.5 text-gold" /> {buyer.exam}
            </span>
            <span className="text-muted-foreground/75 tabular-nums">{buyer.timeAgo}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
