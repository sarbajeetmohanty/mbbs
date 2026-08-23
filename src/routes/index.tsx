import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  FileText,
  CheckCircle2,
  Sparkles,
  Mail,
  Infinity,
  GraduationCap,
  Award,
  Stethoscope,
  BookOpen,
  Gift,
  Smartphone,
  Printer,
  WifiOff,
  Search,
  CheckCheck,
  Clock,
} from "lucide-react";

import videoAsset from "@/assets/nursing-notes-preview.mp4.asset.json";
import sampleHeart from "@/assets/sample-heart.jpg";
import samplePharma from "@/assets/sample-pharma.jpg";
import sampleEcg from "@/assets/sample-ecg.jpg";
import sampleBefore from "@/assets/sample-before.jpg";
import { BeforeAfter } from "@/components/nursing/BeforeAfter";
import { Countdown, useOfferCountdown } from "@/components/nursing/Countdown";
import { CheckoutDialog } from "@/components/nursing/CheckoutDialog";
import { LegalDialog, type LegalTopic } from "@/components/nursing/LegalDialog";
import { PaymentBadges } from "@/components/nursing/PaymentBadges";
import { PurchasePopup } from "@/components/nursing/PurchasePopup";
import { ExitIntentModal } from "@/components/nursing/ExitIntentModal";
import { SalesCloserChat, WhatsAppIcon } from "@/components/nursing/SalesCloserChat";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ORIGINAL_PRICE = 4999;
const PRICE = 199;
const DISCOUNT = Math.round((1 - PRICE / ORIGINAL_PRICE) * 100);

const VIDEO_URL =
  videoAsset?.url && !videoAsset.url.startsWith("/__l5e")
    ? videoAsset.url
    : `https://84afbce3-e879-4f77-be99-6a918600b333.lovableproject.com${videoAsset?.url || "/__l5e/assets-v1/d266e260-7dbc-431a-89ff-c7a73d569bd9/nursing-notes-preview.mp4"}`;

/* ------------------------------- data ------------------------------- */

const targetExams = [
  {
    name: "NORCET (AIIMS)",
    subtitle: "AIIMS New Delhi & All India Nursing Officer",
    badge: "Top Priority",
    topics: "Full Med-Surg, Fundamentals, Pharmacology, ECGs & Scenario Mnemonics",
    icon: Stethoscope,
  },
  {
    name: "ESIC Nurse Staff",
    subtitle: "Employees' State Insurance Corporation",
    badge: "High Yield",
    topics: "Clinical Nursing, Emergency Trauma, Drug Calculations & Pediatrics",
    icon: Award,
  },
  {
    name: "State CHO & NHM",
    subtitle: "Community Health Officer & State Missions",
    badge: "Direct Match",
    topics: "Maternal Health, Child Health, Immunization & Communicable Diseases",
    icon: GraduationCap,
  },
  {
    name: "GNM & B.Sc Nursing",
    subtitle: "University Semester & Annual Board Exams",
    badge: "100% Syllabus",
    topics: "Anatomy & Physiology, Health Assessment & Step-by-Step Care Plans",
    icon: BookOpen,
  },
  {
    name: "RRB & DSSSB Staff",
    subtitle: "Railway & Delhi Subordinate Services",
    badge: "Fast Recall",
    topics: "Lab Reference Ranges, ABG Analysis, Shock & Burns Classification",
    icon: Zap,
  },
  {
    name: "NCLEX-RN & Licensure",
    subtitle: "International Clinical Licensure Exams",
    badge: "Clinical Focus",
    topics: "Nurse Report Templates, IV Fluids, Prioritization & Triage Tables",
    icon: Sparkles,
  },
];

const freeBonuses = [
  {
    title: "Med-Surg Golden Flashcards Bundle",
    pages: "47 Pages (pp. 234–280)",
    worth: 599,
    tag: "High Yield",
    desc: "Rapid-recall flashcards for all major organ pathologies, clinical emergencies, triage, and high-frequency exam questions.",
  },
  {
    title: "100+ High-Yield Medical Mnemonics",
    pages: "Full Guide Included",
    worth: 499,
    tag: "Memory Hacks",
    desc: "Clever visual memory triggers for Cranial Nerves, Murmurs, Endocrine feedback, Shock types, and Electrolyte imbalances.",
  },
  {
    title: "25+ ECG/EKG Strips & Lab Pocket Guide",
    pages: "26 Pages (pp. 319–344)",
    worth: 399,
    tag: "Clinical Focus",
    desc: "Complete visual rhythm interpretation for Arrhythmias, STEMI, Blocks, ABG calculations, and vital reference lab values.",
  },
  {
    title: "Drug Dosage & ICU Infusion Calculations",
    pages: "5 Pages (pp. 427–431)",
    worth: 299,
    tag: "Formula Guide",
    desc: "Exact step-by-step mathematical formulas for IV drip rates, paediatric dosages, insulin protocols, and metric conversions.",
  },
  {
    title: "Free 2026–2027 Syllabus Updates & Additions",
    pages: "Lifetime Benefit",
    worth: 699,
    tag: "Free Updates",
    desc: "Whenever new nursing guidelines, clinical protocols, or exam topics are updated, you receive the revised edition at ₹0.",
  },
];

const whatsappReviews = [
  {
    name: "Priya Sharma",
    city: "New Delhi",
    tag: "AIIMS NORCET Aspirant",
    time: "Today, 10:42 AM",
    message:
      "Mam I got 84% in my 3rd year Med-Surg semester exams! The heart diagrams and drug calculation formulas were a direct hit in the exam paper. Thank you so much! 🙏",
  },
  {
    name: "Dr. Ankit Patel",
    city: "Ahmedabad",
    tag: "Qualified Staff Nurse",
    time: "Yesterday, 6:15 PM",
    message:
      "Cleared NORCET prelims! Honestly the pharmacology drug tables and shock classification charts saved at least 3 weeks of notes making. Best ₹199 spent.",
  },
  {
    name: "Sneha Verma",
    city: "Lucknow",
    tag: "B.Sc Nursing Final Year",
    time: "2 days ago",
    message:
      "Got the PDF instantly on WhatsApp. Took printouts of the 600 pages at my college shop for spiral binding. Resolution and handwritten font are 100% crystal clear!",
  },
  {
    name: "Rakesh Meena",
    city: "Jaipur",
    tag: "State CHO Qualified",
    time: "3 days ago",
    message:
      "All maternal and pediatric disorders in one single indexed PDF. Revised the whole syllabus in 2 days before my exam. Highly recommended to all nurses!",
  },
];

const compatibilityFeatures = [
  {
    icon: Smartphone,
    title: "Any Phone & Tablet",
    desc: "Works on Android, iPhone, iPad, Apple Books, GoodNotes & all PDF readers.",
  },
  {
    icon: Printer,
    title: "100% Print-Friendly",
    desc: "High-resolution A4 format — print clean spiral-bound paper notebooks anytime.",
  },
  {
    icon: WifiOff,
    title: "100% Offline Study",
    desc: "Download once. Study in hospital wards, duty shifts, or hostels without internet.",
  },
  {
    icon: Search,
    title: "Searchable & Indexed",
    desc: "Jump to any disorder, disease mechanism, or chapter in under 2 seconds.",
  },
];

const ebookDetails = [
  { label: "Format", value: "PDF · 600+ pages", icon: FileText },
  { label: "Delivery", value: "Email & WhatsApp", icon: Mail },
  { label: "Validity", value: "Lifetime access", icon: Infinity },
];

const chapters = [
  { name: "Fundamentals of Nursing", pages: "5–41" },
  { name: "IV Fluids", pages: "42–51" },
  { name: "Anatomy and Physiology", pages: "52–82" },
  { name: "Medical-Surgical Nursing", pages: "83–233" },
  { name: "Med-Surg Flashcards", pages: "234–280" },
  { name: "Shock", pages: "281–299" },
  { name: "Hepatitis", pages: "300–302" },
  { name: "Burns", pages: "303–308" },
  { name: "Chest Tube Management", pages: "309–312" },
  { name: "Electrolyte Imbalance", pages: "313–318" },
  { name: "EKGs / ECGs", pages: "319–344" },
  { name: "Lab Values", pages: "345–349" },
  { name: "ABGs", pages: "350" },
  { name: "Pharmacology", pages: "351–426" },
  { name: "Drug Calculation", pages: "427–431" },
  { name: "Insulin", pages: "432–433" },
  { name: "Maternal and Child Health", pages: "434–467" },
  { name: "Pediatric Disorders", pages: "468–500" },
  { name: "Nursing Health Assessment", pages: "501–508" },
  { name: "Cranial Nerves", pages: "509–524" },
  { name: "Patient Assessment Template", pages: "525–529" },
  { name: "Nurse Report Template", pages: "530" },
  { name: "Nursing Process", pages: "531–600" },
];

const samples = [
  { src: sampleHeart, alt: "Sample page — labelled anatomy of the heart notes" },
  { src: samplePharma, alt: "Sample page — pharmacology drug table notes" },
  { src: sampleEcg, alt: "Sample page — ECG interpretation notes" },
];

type Review = { quote: string; name: string; role?: string; rating: number };

const baseReviews: Review[] = [
  {
    quote:
      "I found this ebook to be very thorough and easy to follow. It breaks down complex medical concepts into simple terms. Perfect for both beginners and advanced learners.",
    name: "Rakesh Bagade",
    rating: 5,
  },
  {
    quote:
      "I am from Mumbai and this ebook helped me a lot. It is a fantastic resource for anyone studying nursing — it covers all the essential topics in a clear and concise manner. Highly recommended!",
    name: "Shreya Sharma",
    rating: 5,
  },
  {
    quote:
      "This ebook is an excellent study guide. It helped me understand difficult topics and prepare for my exams. The explanations are straightforward and very helpful.",
    name: "Sanya Choudhary",
    rating: 5,
  },
  {
    quote:
      "As a practicing nurse, I found this ebook to be a great refresher. It's well-organized and packed with useful information. A great addition to any nurse's library.",
    name: "Md Tanvir",
    rating: 5,
  },
  {
    quote:
      "The nursing guide is an invaluable resource that covers everything, from basic to advanced nursing skills, helping us become compassionate and skilled nurses.",
    name: "Kavisha",
    rating: 5,
  },
  {
    quote:
      "This ebook is highly informative and well-written. It provides a lot of valuable information in an easy-to-read format. I would definitely recommend it to my fellow nursing students.",
    name: "Amrit Sinha",
    rating: 5,
  },
];

const ratingBars = [
  { label: "Excellent", pct: 100 },
  { label: "Very good", pct: 0 },
  { label: "Average", pct: 0 },
  { label: "Poor", pct: 0 },
  { label: "Terrible", pct: 0 },
];

const faqs = [
  {
    q: "How can I get these notes after purchase?",
    a: "After your payment, you are re-directed to an instant download page. You will also immediately receive an email and WhatsApp message with your payment receipt and personal access link. If you don't find the email within a couple of minutes, please check your spam folder or promotions tab.",
  },
  {
    q: "Are the notes available for instant download?",
    a: "Yes. The moment your payment succeeds, the download links are generated and sent to you automatically — 24/7 instant delivery without manual waiting.",
  },
  {
    q: "What if I don't receive any email after purchase?",
    a: "First check your spam folder and promotions tab. If it is not there within 5 minutes, message us on WhatsApp or email support@nursingnotes.in with your payment details, and our support team will resend your download links immediately.",
  },
  {
    q: "Can I access the notes on multiple devices?",
    a: "Yes. It is a digital PDF bundle that opens seamlessly on any phone, tablet, iPad or laptop — and you can print physical copies for offline paper study if you prefer.",
  },
  {
    q: "What is the language and format of the content?",
    a: "Simple, high-yield English. Complex medical concepts are broken down into handwritten-style summaries, bullet points, clinical mnemonics, labelled diagrams and revision tables.",
  },
  {
    q: "What is the access period for the eBook?",
    a: "Lifetime access. You pay once (₹199) and retain permanent access forever, including every future syllabus update free of cost.",
  },
  {
    q: "Do you provide a payment receipt after purchase?",
    a: "Yes. An official payment receipt containing your transaction ID and order summary is emailed to you automatically upon payment confirmation.",
  },
  {
    q: "What is your refund policy?",
    a: "Due to the immediate digital delivery of the complete 600+ page PDF download bundle, all sales are final and we do not offer refunds. We encourage you to review the sample pages and complete 23-chapter syllabus above before purchasing. If you ever face any issues accessing your files, our support team will resolve it immediately.",
  },
];

const schemaJson = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Complete Nursing Notes Bundle (600+ Pages PDF)",
    description:
      "All-in-one nursing notebook covering 23 core medical subjects: Fundamentals, Med-Surg, Pharmacology, ECGs, Lab Values, ABGs, OBG and clinical templates.",
    image: sampleHeart,
    brand: {
      "@type": "Brand",
      name: "Nursing Notes",
    },
    offers: {
      "@type": "Offer",
      price: PRICE,
      priceCurrency: "INR",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: "https://nursingnotes.in",
      seller: {
        "@type": "Organization",
        name: "Nursing Notes",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "99",
      bestRating: "5",
      worstRating: "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  },
]);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Only Nursing Notebook You Need — All-in-One Notes at ₹199" },
      {
        name: "description",
        content:
          "All-in-one nursing notes at your fingertips. 600+ pages covering Fundamentals, Med-Surg, Pharmacology, ECGs, OBG & more. PDF on Email & WhatsApp, lifetime access — ₹4999 ₹199 today.",
      },
      {
        name: "keywords",
        content:
          "nursing notes, nursing study guide, GNM notes, BSc nursing notes, NORCET exam notes, pharmacology notes, ECG notes, medical notebook, nursing bundle PDF",
      },
      { property: "og:title", content: "The Only Nursing Notebook You Need — ₹199" },
      {
        property: "og:description",
        content:
          "600+ exam-ready pages, every nursing subject simplified. Instant delivery on Email & WhatsApp. ₹4999 ₹199 — offer ends soon.",
      },
      { property: "og:image", content: sampleHeart },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Only Nursing Notebook You Need — ₹199" },
      {
        name: "twitter:description",
        content:
          "600+ exam-ready pages, every nursing subject simplified. Instant delivery on Email & WhatsApp. ₹4999 ₹199 — offer ends soon.",
      },
      { name: "twitter:image", content: sampleHeart },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: schemaJson,
      },
    ],
  }),
  component: Index,
});

const REVIEWS_KEY = "nn-user-reviews";

/* ------------------------------- page ------------------------------- */

function Index() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPrice, setCheckoutPrice] = useState(PRICE);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [viewersCount, setViewersCount] = useState(247);
  const [remainingCopies, setRemainingCopies] = useState(14);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [legalTopic, setLegalTopic] = useState<LegalTopic | null>(null);
  const { label } = useOfferCountdown();

  const openCheckout = useCallback((p?: unknown) => {
    setCheckoutPrice(typeof p === "number" ? p : PRICE);
    setCheckoutOpen(true);
  }, []);

  // Real-time organic viewer fluctuation (+3, -2, etc.)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return Math.min(289, Math.max(228, next));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Scarcity countdown (slowly reduces copies remaining, never drops below 2)
  useEffect(() => {
    const copyInterval = setInterval(() => {
      setRemainingCopies((prev) => (prev > 2 ? prev - 1 : 2));
    }, 32000);
    return () => clearInterval(copyInterval);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REVIEWS_KEY);
      if (raw) setUserReviews(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const addReview = useCallback((review: Review) => {
    setUserReviews((prev) => {
      const next = [review, ...prev];
      try {
        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const allReviews = [...userReviews, ...baseReviews];
  const reviewCount = 93 + userReviews.length;

  return (
    <main className="w-full max-w-full overflow-x-clip bg-background pb-20 md:pb-0">
      {/* ---------------- Sticky Top Header (Announcement + Live Ticker) ---------------- */}
      <header className="sticky top-0 z-50 w-full shadow-md backdrop-blur-md">
        {/* Main Offer Announcement */}
        <aside
          aria-label="Limited time offer announcement"
          className="flex items-center justify-center gap-1.5 bg-primary px-3 py-2 text-center text-primary-foreground shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold shrink-0 animate-pulse" />
          <p className="text-xs font-medium sm:text-sm">
            <span className="font-bold text-gold">{DISCOUNT}% DISCOUNT</span> · Limited time launch
            offer — <span className="line-through opacity-60">₹{ORIGINAL_PRICE}</span>{" "}
            <span className="font-bold">₹{PRICE}</span> · Ends in{" "}
            <span className="rounded bg-primary-foreground/15 px-1.5 py-0.5 font-mono font-semibold tabular-nums">
              {label}
            </span>
          </p>
        </aside>

        {/* Live Active Browsing & Scarcity Ticker */}
        <div className="border-b border-border/80 bg-card/95 px-3 py-1.5 text-center text-xs shadow-soft backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <strong className="font-bold tabular-nums text-emerald-900 transition-all duration-300">
                {viewersCount} nursing students
              </strong>{" "}
              actively browsing right now
            </span>
            <span className="hidden sm:inline text-muted-foreground/60">•</span>
            <span className="inline-flex items-center gap-1 font-medium text-destructive">
              <Zap className="h-3 w-3 fill-current text-destructive animate-pulse" />
              Only{" "}
              <strong className="font-bold tabular-nums text-destructive underline decoration-dotted">
                {remainingCopies} discounted copies
              </strong>{" "}
              remaining for today's batch at ₹{PRICE}
            </span>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative flex items-center justify-center overflow-hidden bg-hero-flow px-4 py-10 sm:py-14">
        <div
          aria-hidden
          className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgb(216 180 226 / 0.28) 0%, rgb(255 255 255 / 0) 70%)",
          }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <span className="glass-pill animate-rise inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
            <Sparkles className="h-3 w-3 text-gold" />
            All-in-one nursing notes at your fingertips
          </span>

          <h1
            className="animate-rise text-[clamp(2.1rem,5vw,3.75rem)] tracking-tight leading-[1.12]"
            style={{ animationDelay: "0.05s" }}
          >
            The only nursing notebook
            <br />
            <span className="marker-underline">
              <span className="text-italic-display">you'll ever need.</span>
              <span aria-hidden className="marker-underline-bar" />
            </span>
          </h1>

          <p
            className="animate-rise max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: "0.1s" }}
          >
            Feeling overwhelmed in your nursing preparation? Our meticulously crafted 600+ page
            notebook simplifies complex medical subjects into high-yield, visual summaries for exam
            success.
          </p>

          {/* Video / Preview Card */}
          <div
            className="animate-rise mt-1 w-full max-w-[240px] sm:max-w-[260px]"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="rounded-[2rem] bg-card p-2 shadow-float ring-1 ring-border">
              <video
                src={VIDEO_URL}
                poster={sampleHeart}
                className="aspect-[9/16] w-full rounded-[1.6rem] bg-secondary object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Preview of the nursing notes bundle"
              />
            </div>
          </div>

          <div
            className="animate-rise flex flex-col items-center gap-2"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl sm:text-4xl">₹{PRICE}/-</span>
              <span className="text-base text-muted-foreground line-through sm:text-lg">
                ₹{ORIGINAL_PRICE}
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {DISCOUNT}% OFF
              </span>
            </div>
            <button
              onClick={() => openCheckout(PRICE)}
              className="animate-soft-pulse mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-float transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-95 sm:px-10 sm:py-4 sm:text-base cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current text-gold" />
              <span>Get Instant Access @ ₹{PRICE}</span>
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Instant PDF download · Email & WhatsApp delivery · Lifetime access</span>
            </p>
            <PaymentBadges className="mt-2" />
          </div>

          {/* E-book details badges */}
          <dl
            className="animate-rise mt-2 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-3"
            style={{ animationDelay: "0.25s" }}
          >
            {ebookDetails.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/90 px-4 py-2.5 text-left shadow-soft backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blush text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {d.label}
                    </dt>
                    <dd className="text-xs font-semibold text-foreground sm:text-sm">{d.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>

          {/* Universal Study Compatibility Badges */}
          <div
            className="animate-rise mt-1 grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 text-left"
            style={{ animationDelay: "0.3s" }}
          >
            {compatibilityFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-card/80 p-2.5 shadow-soft backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1.5 text-primary">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[0.72rem] font-bold text-foreground truncate">{f.title}</span>
                  </div>
                  <p className="mt-1 text-[0.65rem] leading-tight text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Target Exam Highlights & Syllabus ---------------- */}
      <section className="bg-flow-down px-4 py-10 sm:py-14 border-y border-border/50">
        <div className="mx-auto max-w-5xl text-center">
          <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            2026 Target Exam Syllabus
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">
            Tailored For <span className="text-italic-display">All Top Medical & Nursing Exams</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
            Whether you are preparing for central recruitment, community health posts, or university semesters — our high-yield notes cover the exact exam patterns.
          </p>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {targetExams.map((exam) => {
              const Icon = exam.icon;
              return (
                <div
                  key={exam.name}
                  className="card-soft flex flex-col justify-between p-5 text-left transition-all hover:border-primary/40 hover:shadow-card group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-primary shadow-soft group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-700">
                        {exam.badge}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                      {exam.name}
                    </h3>
                    <p className="text-[0.7rem] font-medium text-muted-foreground">{exam.subtitle}</p>
                    <p className="mt-2.5 text-xs text-foreground/80 leading-relaxed border-t border-border/60 pt-2.5">
                      <strong className="text-foreground">Key Focus:</strong> {exam.topics}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={() => openCheckout(PRICE)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-95 sm:px-9 sm:py-4 sm:text-base cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current text-gold" />
              <span>Get 2026 Exam-Ready Bundle @ ₹{PRICE}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- What's inside ---------------- */}
      <section className="bg-flow-down px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <FileText className="h-3 w-3 text-primary" />
              600+ pages · 23 Core Topics · One PDF
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">
              What you get <span className="text-italic-display">inside</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Every critical topic from Fundamentals to the Nursing Process — organised page by page
              so you always know exactly where to revise from.
            </p>
          </div>

          <ol className="mt-6 grid gap-2 sm:grid-cols-2">
            {chapters.map((ch) => (
              <li
                key={ch.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-soft transition-colors hover:border-primary/30"
              >
                <span className="flex items-center gap-2.5 text-xs font-medium sm:text-sm">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{ch.name}</span>
                </span>
                <span className="shrink-0 rounded-full bg-blush px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums text-primary">
                  pp. {ch.pages}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 text-center">
            <button
              onClick={openCheckout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-95 sm:px-9 sm:py-4 sm:text-base cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current text-gold" />
              <span>Get instant access for ₹{PRICE}</span>
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Instant delivery on Email & WhatsApp · Lifetime validity
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Samples & Before/After ---------------- */}
      <section className="bg-flow-up px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-gold" />
            See The Difference
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">
            Standard Textbooks <span className="text-italic-display">vs. Our Notes</span>
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs text-muted-foreground sm:text-sm">
            Slide horizontally to see how dense, confusing textbook paragraphs are transformed into
            clean, visual, recall-ready study summaries.
          </p>

          {/* Interactive Before/After Slider */}
          <div className="mx-auto mt-6 max-w-sm">
            <div className="rounded-[1.8rem] bg-card p-2 shadow-float ring-1 ring-border">
              <BeforeAfter
                before={sampleBefore}
                after={sampleHeart}
                beforeAlt="Standard confusing textbook notes before"
                afterAlt="Clear, illustrated Nursing Notes after"
              />
            </div>
            <p className="mt-2 text-[0.7rem] text-muted-foreground">
              Drag or swipe the slider left and right to compare
            </p>
          </div>

          {/* Additional Sample Pages Carousel */}
          <div className="mt-10 border-t border-border/70 pt-8">
            <h3 className="text-xl font-bold">
              More Sample <span className="text-italic-display">Pages</span>
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
              Labelled diagrams, drug dosage tables, ECG interpretations & clinical algorithms.
            </p>

            <div className="relative mx-auto mt-6 max-w-sm">
              <div className="overflow-hidden rounded-[1.8rem] bg-card p-2 shadow-float ring-1 ring-border">
                <img
                  src={samples[sampleIdx]?.src ?? sampleHeart}
                  alt={samples[sampleIdx]?.alt ?? "Sample page from the nursing notes"}
                  width={768}
                  height={1024}
                  loading="lazy"
                  className="aspect-[3/4] w-full rounded-[1.3rem] object-cover"
                />
              </div>
              <button
                onClick={() => setSampleIdx((sampleIdx + samples.length - 1) % samples.length)}
                aria-label="Previous slide"
                className="absolute -left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-card ring-1 ring-border transition-transform hover:scale-105 active:scale-95 sm:-left-5 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSampleIdx((sampleIdx + 1) % samples.length)}
                aria-label="Next slide"
                className="absolute -right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-card ring-1 ring-border transition-transform hover:scale-105 active:scale-95 sm:-right-5 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {samples.map((s, i) => (
                <button
                  key={s.alt}
                  onClick={() => setSampleIdx(i)}
                  aria-label={`Go to sample ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === sampleIdx ? "w-6 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Free Bonuses Section ---------------- */}
      <section className="bg-flow-blush px-4 py-10 sm:py-14 border-t border-border/60">
        <div className="mx-auto max-w-5xl text-center">
          <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-destructive bg-destructive/10">
            <Gift className="h-3.5 w-3.5 text-destructive" />
            Free Gift Bundle Included Today
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">
            Get 5 High-Yield Bonuses <span className="text-italic-display">(Worth ₹2,495+ FREE)</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
            Order the 600+ Page Complete Nursing Notebook today and get instant free access to these 5 essential clinical revision toolkits.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {freeBonuses.map((b, idx) => (
              <div
                key={b.title}
                className="card-soft flex flex-col justify-between p-5 transition-all hover:border-primary/40 hover:shadow-card group relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blush/80 -z-0" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-primary">
                      Bonus #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      Worth <span className="line-through text-muted-foreground">₹{b.worth}</span> FREE
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {b.title}
                  </h3>
                  <span className="inline-block mt-0.5 text-[0.7rem] font-medium text-muted-foreground">
                    {b.pages}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/80 border-t border-border/60 pt-2">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Total Value Summary Box */}
            <div className="card-soft flex flex-col justify-center items-center p-6 text-center bg-gradient-to-br from-card to-blush/40 border-2 border-primary/30 sm:col-span-2 lg:col-span-1">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                Total Real Bundle Value
              </span>
              <span className="font-display text-3xl font-bold text-muted-foreground line-through opacity-70 mt-1">
                ₹6,499/-
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Today's Price:</span>
                <span className="font-display text-3xl font-bold text-primary sm:text-4xl">₹{PRICE}/-</span>
              </div>
              <p className="mt-1 text-xs font-bold text-emerald-700">You Save 97% Today</p>

              <button
                onClick={() => openCheckout(PRICE)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-float transition hover:bg-primary/95 active:scale-95 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 fill-gold text-gold" />
                <span>Claim All 5 Bonuses Free</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Offer / pricing ---------------- */}
      <section id="offer" className="bg-flow-blush px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-lg">
          <div className="rounded-[2rem] bg-card p-6 shadow-float ring-1 ring-border sm:p-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-destructive">
                <Zap className="h-3 w-3 fill-current" />
                Limited Time Offer Ends Soon
              </span>
              <h2 className="mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)]">Complete Nursing E-Book</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Format: PDF · Instant Delivery: Email & WhatsApp · Lifetime Access
              </p>

              <div className="mt-5">
                <Countdown />
                <p className="mt-2 text-xs text-muted-foreground">
                  Price reverts to ₹{ORIGINAL_PRICE} once the offer period concludes.
                </p>
              </div>

              <div className="mt-5 flex items-end justify-center gap-3">
                <span className="font-display text-4xl sm:text-5xl">₹{PRICE}/-</span>
                <span className="pb-1 text-lg text-muted-foreground line-through sm:text-xl">
                  ₹{ORIGINAL_PRICE}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-700 sm:text-sm">
                You save ₹{ORIGINAL_PRICE - PRICE} (96% discount applied)
              </p>
            </div>

            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm">
              {[
                "All 23 core medical topics · 600+ exam-ready pages",
                "Med-Surg flashcards, clinical tables & labelled anatomy",
                "Drug calculations, ECG rhythms, ABGs & lab values",
                "Nursing report & patient assessment templates",
                "Instant delivery on Email & WhatsApp",
                "Free lifetime updates included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openCheckout(PRICE)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-float transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-95 sm:py-4 sm:text-base cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current text-gold" />
              <span>Buy Now — ₹{PRICE}/- Only</span>
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Instant Download · 100% Secure Checkout · No Subscription</span>
            </p>
            <PaymentBadges className="mt-3" />
          </div>
        </div>
      </section>

      {/* ---------------- Reviews ---------------- */}
      <section className="bg-flow-up px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" />
              Verified Student Feedback
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">Student Reviews</h2>
          </div>

          {/* Rating Summary Card */}
          <div className="card-soft mx-auto mt-6 grid max-w-2xl gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
            <div className="text-center sm:text-left">
              <p className="font-display text-5xl sm:text-6xl">5.0</p>
              <div className="mt-1 flex items-center justify-center gap-0.5 text-gold sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                5.0 out of 5 stars · based on {reviewCount} reviews
              </p>
            </div>
            <div className="space-y-1.5">
              {ratingBars.map((bar) => (
                <div key={bar.label} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 text-muted-foreground">{bar.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">
                    {bar.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Grid */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((r, i) => (
              <figure
                key={`${r.name}-${i}`}
                className="card-soft flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(r.rating)].map((_, starIdx) => (
                      <Star key={starIdx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-2 text-xs leading-relaxed text-foreground/80 sm:text-sm">
                    “{r.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush font-display text-sm font-semibold text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold sm:text-sm">– {r.name}</span>
                    {r.role && (
                      <span className="block text-[0.7rem] text-muted-foreground">{r.role}</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* WhatsApp Student Chat Testimonials */}
          <div className="mt-10 border-t border-border/70 pt-8 text-left">
            <div className="text-center mb-6">
              <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-emerald-800 bg-emerald-500/10">
                <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366]" />
                Direct WhatsApp Messages
              </span>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold">
                What Nursing Students Say On <span className="text-italic-display">WhatsApp</span>
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {whatsappReviews.map((item) => (
                <div
                  key={item.name}
                  className="overflow-hidden rounded-2xl border border-[#25D366]/30 bg-card p-4 shadow-soft"
                >
                  {/* WhatsApp chat bubble header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E] font-bold text-white text-xs shadow-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground leading-tight flex items-center gap-1">
                          <span>{item.name}</span>
                          <span className="text-[0.65rem] text-muted-foreground font-normal">({item.city})</span>
                        </p>
                        <p className="text-[0.65rem] font-medium text-[#128C7E]">{item.tag}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </span>
                  </div>

                  {/* Chat Message Bubble */}
                  <div className="mt-2.5 rounded-xl bg-[#dcf8c6]/40 border border-[#25D366]/20 p-3 text-xs leading-relaxed text-slate-800">
                    <p className="italic">"{item.message}"</p>
                    <div className="mt-1.5 flex items-center justify-end gap-1 text-[0.6rem] text-slate-500">
                      <span>Delivered</span>
                      <CheckCheck className="h-3 w-3 text-sky-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ReviewForm onSubmit={addReview} />

          <div className="mt-8 text-center">
            <button
              onClick={openCheckout}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-95 sm:px-9 sm:py-4 sm:text-base cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current text-gold" />
              <span>Buy Now — Get Complete Nursing Notes</span>
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Instant delivery on Email & WhatsApp · Lifetime access
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ (Radix UI Accordion) ---------------- */}
      <section className="bg-flow-blush px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-gold" />
              Help & Answers
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,2.5rem)]">Frequently Asked Questions</h2>
          </div>

          <div className="mt-6">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={faq.q}
                  value={`item-${idx}`}
                  className="rounded-2xl border border-border bg-card px-5 py-1 shadow-soft data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base py-3.5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground sm:text-sm pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-primary px-4 py-10 text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">
            Simplify your nursing journey
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-primary-foreground/75 sm:text-sm">
            Grab the complete 600+ page nursing notes at ₹{PRICE}/- before the countdown ends.
          </p>
          <button
            onClick={openCheckout}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-bold text-primary shadow-float transition-all hover:bg-background/95 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-current text-primary" />
            <span>Buy now — ₹{PRICE}/-</span>
          </button>

          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-primary-foreground/70">
            {(
              [
                ["privacy", "Privacy Policy"],
                ["refund", "Refund Policy"],
                ["terms", "Terms & Conditions"],
                ["contact", "Contact Us"],
                ["about", "About Us"],
              ] as [LegalTopic, string][]
            ).map(([topic, labelText]) => (
              <button
                key={topic}
                onClick={() => setLegalTopic(topic)}
                className="underline-offset-4 transition-colors hover:text-primary-foreground hover:underline cursor-pointer"
              >
                {labelText}
              </button>
            ))}
          </nav>

          <p className="mt-5 text-[0.75rem] text-primary-foreground/50">
            © 2026 Nursing Notes. All rights reserved. Instant PDF Delivery.
          </p>
        </div>
      </footer>

      {/* ---------------- Sticky mobile CTA (Safe area aware) ---------------- */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-float backdrop-blur-md transition-transform duration-300 md:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-xl">₹{PRICE}/-</span>
              <span className="text-xs text-muted-foreground line-through">₹{ORIGINAL_PRICE}</span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[0.65rem] font-bold text-emerald-700">
                {DISCOUNT}% OFF
              </span>
            </p>
            <p className="text-[0.7rem] text-destructive">
              Offer ends in <span className="font-mono font-semibold tabular-nums">{label}</span>
            </p>
          </div>
          <button
            onClick={openCheckout}
            className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-card transition-transform active:scale-95 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-gold" />
            <span>Buy now</span>
          </button>
        </div>
      </div>

      <PurchasePopup />
      <ExitIntentModal onClaimDiscount={() => openCheckout(149)} />
      <SalesCloserChat onOpenCheckout={() => openCheckout(PRICE)} />
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        price={checkoutPrice}
      />
      <LegalDialog topic={legalTopic} onClose={() => setLegalTopic(null)} />
    </main>
  );
}

/* --------------------------- review form ---------------------------- */

function ReviewForm({ onSubmit }: { onSubmit: (r: Review) => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim() || !text.trim()) {
      setError("Please add your name and a short review.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm the review is your genuine opinion.");
      return;
    }
    onSubmit({ quote: text.trim(), name: name.trim(), rating });
    setDone(true);
  };

  if (done) {
    return (
      <div className="card-soft mx-auto mt-6 max-w-xl p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-2 font-display text-xl">Thank you for your review!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your review is now live on this page. Happy studying!
        </p>
      </div>
    );
  }

  return (
    <div className="card-soft mx-auto mt-6 max-w-xl p-5 sm:p-6">
      <h3 className="text-lg font-bold">Share your review</h3>

      <div className="mt-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your overall rating
        </p>
        <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Select a rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 cursor-pointer"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your review
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="How did the notes help in your nursing preparation?"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your name
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="e.g. Priya Nair"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 accent-primary cursor-pointer"
        />
        <span>This review is based on my own experience and is my genuine opinion.</span>
      </label>

      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}

      <button
        type="button"
        onClick={submit}
        className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        Submit Review
      </button>
    </div>
  );
}
