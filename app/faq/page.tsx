import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const APP = "https://app.nextsole.co.uk";

export const metadata: Metadata = {
  title: "FAQ — Nextsole",
  description: "Answers to common questions about Nextsole — pricing, platforms, data privacy, and how it compares to a spreadsheet or the StockX app.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk/faq",
    siteName: "Nextsole",
    title: "FAQ — Nextsole",
    description: "Answers to common questions about Nextsole.",
  },
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is Nextsole free?",
    a: (
      <>
        Yes — free for up to 5 pairs, with market price tracking and one daily rotation pick. Pro (£4.99/month or
        £39.99/year) removes the pair limit and adds price history charts, CSV import/export, weather-aware rotation,
        gallery images, and custom tags. No credit card is needed to start on the free tier.
      </>
    ),
  },
  {
    q: "Do I need an Android phone?",
    a: (
      <>
        No. Nextsole is a web app first — it works in any modern browser on any device, including iPhone (you can
        install it to your home screen like a native app). There's also a dedicated native app on{" "}
        <a href="https://play.google.com/store/apps/details?id=com.blacksheepsoftware.nextsole" className="text-lime-400 hover:underline" target="_blank" rel="noopener noreferrer">
          Google Play
        </a>{" "}
        for Android, but it isn't required — everything works on the web version too.
      </>
    ),
  },
  {
    q: "Is my payment information safe?",
    a: (
      <>
        Yes. All payments are processed by Stripe — Nextsole never sees or stores your full card number, expiry date,
        or CVC. See our{" "}
        <a href={`${APP}/privacy`} className="text-lime-400 hover:underline">Privacy Policy</a> for details.
      </>
    ),
  },
  {
    q: "Can I cancel Pro at any time?",
    a: (
      <>
        Yes, any time from Settings → Manage subscription. Cancelling takes effect at the end of your current billing
        period — you keep Pro access until then, and there are no cancellation fees.
      </>
    ),
  },
  {
    q: "Is my collection private?",
    a: (
      <>
        Yes, by default your collection is private and only visible to you. You can optionally make a public profile
        (with control over exactly what it shows — your collection, your stats, or just your badges) if you want to
        appear on the leaderboard or share your collection with others.
      </>
    ),
  },
  {
    q: "Can I export my data?",
    a: (
      <>
        Yes — download your full collection as CSV (for spreadsheets) or JSON (a complete backup) any time from
        Settings. Your data is yours; there's no lock-in.
      </>
    ),
  },
  {
    q: "Why not just use a spreadsheet or the StockX/GOAT app?",
    a: (
      <>
        A spreadsheet doesn't track live market value, wear history, or which pair to reach for today — you'd have to
        maintain all of that by hand. Marketplace apps like StockX or GOAT are built for buying and selling, not for
        managing a collection you already own: they don't track wear count, condition over time, rotation, or give you
        badges/streaks for actually wearing your shoes. Nextsole is built specifically for collectors who want to
        track, value, and actually use what they own.
      </>
    ),
  },
  {
    q: "Where does the market price data come from?",
    a: (
      <>
        From real recent sales/listing data for each SKU, refreshed regularly. Prices are shown in your chosen market
        and currency (UK/£ or US/$) and are indicative — actual resale value depends on condition, size demand, and
        where you sell.
      </>
    ),
  },
  {
    q: "What happens if I delete my account?",
    a: (
      <>
        Your account, entire collection (shoes, photos, notes, wear history), public profile, badges, and leaderboard
        activity are deleted permanently and immediately. You can also just clear your collection while keeping your
        account active, if you want a fresh start without losing your sign-in. See{" "}
        <a href={`${APP}/privacy`} className="text-lime-400 hover:underline">Privacy Policy</a> for the full details.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto min-h-screen max-w-2xl px-4 pb-24 pt-32 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">FAQ</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 max-w-lg text-neutral-400">
          Everything you need to know before you start tracking your collection.
        </p>

        <div className="mt-12 space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="shrink-0 text-neutral-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{a}</p>
            </details>
          ))}
        </div>

        <p className="mt-12 text-sm text-neutral-500">
          Still have a question? <Link href="/#pricing" className="text-lime-400 hover:underline">Check the pricing details</Link>{" "}
          or <a href={`${APP}/feedback`} className="text-lime-400 hover:underline">get in touch</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
