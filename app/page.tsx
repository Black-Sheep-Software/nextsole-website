import Image from "next/image";
import Link from "next/link";
import AppScreenshotCarousel from "./AppScreenshotCarousel";

const APP = "https://app.nextsole.co.uk";
const SIGNIN = `${APP}/login`;
const PRICING = `${APP}/pricing`;

// ── Icons ──────────────────────────────────────────────────────────────────

function IconCollection() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function IconPrice() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function IconRotation() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function IconAI() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Image src="/nextsole-logo.png" alt="Nextsole" width={120} height={34} className="h-7 w-auto" priority />
        <div className="flex items-center gap-3">
          <Link href={SIGNIN} className="text-sm font-semibold text-neutral-400 hover:text-white transition">
            Sign in
          </Link>
          <Link href={SIGNIN} className="rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-black hover:bg-lime-300 transition">
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Gradient overlays sit on top of the page-level fixed backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-neutral-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-400/10 px-3 py-1.5 text-xs font-semibold text-lime-400">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
              Free to start · Upgrade anytime
            </div>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Track every pair.<br />
              <span className="text-lime-400">Know every value.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-300 leading-relaxed max-w-lg">
              Nextsole keeps your sneaker collection organised, valued and ready to wear. Add your kicks, see what they&apos;re worth, and get a daily rotation pick.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={SIGNIN} className="rounded-xl bg-lime-400 px-7 py-4 text-base font-bold text-black hover:bg-lime-300 transition shadow-lg shadow-lime-400/20">
                Start for free
              </Link>
              <Link href={SIGNIN} className="rounded-xl border border-neutral-600 px-7 py-4 text-base font-semibold text-neutral-300 hover:border-neutral-400 hover:text-white transition">
                Sign in →
              </Link>
            </div>
            <p className="mt-4 text-sm text-neutral-500">Free for up to 5 pairs · No credit card needed</p>
          </div>

          <div className="lg:pl-6">
            <AppScreenshotCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: <IconCollection />,
      title: "Your entire collection, in one place",
      body: "Add any sneaker in seconds — search our catalogue or enter manually. Track size, condition, purchase price and provenance.",
    },
    {
      icon: <IconPrice />,
      title: "Real market values, always current",
      body: "See what your pairs are worth today. Track price movement against what you paid and watch your portfolio grow.",
    },
    {
      icon: <IconRotation />,
      title: "Smart daily rotation",
      body: "Nextsole picks which pair to wear next based on your history. Your whole collection, actually in rotation.",
    },
    {
      icon: <IconAI />,
      title: "Rich shoe data, built in",
      body: "Descriptions, colourways, pack history and key tech — filled in automatically for every shoe you add.",
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-400 font-semibold">Features</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Everything your collection needs</h2>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto text-lg">
            Built for serious sneakerheads who want more than a spreadsheet.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-700 transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                {f.icon}
              </div>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ───────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { number: "01", title: "Add your kicks", body: "Search our sneaker catalogue or enter manually. Every pair you own, in one place in seconds." },
    { number: "02", title: "Track the value", body: "Market pricing updates automatically. See your collection's total worth and individual gains." },
    { number: "03", title: "Wear smarter", body: "Get a daily pick based on what you haven't worn recently. Your whole shelf, finally in rotation." },
  ];

  return (
    <section className="py-24 sm:py-32 border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-400 font-semibold">How it works</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Up and running in minutes</h2>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-[calc(50%+2.5rem)] hidden sm:block w-[calc(100%-5rem)] border-t border-dashed border-neutral-700" />
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-sm font-black text-black shadow-lg shadow-lime-400/20">
                {step.number}
              </div>
              <h3 className="mt-5 font-bold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────────────────────

function PricingTable() {
  const rows = [
    { feature: "Collection size", free: "Up to 5 pairs", pro: "Unlimited" },
    { feature: "Sneaker catalogue search", free: true, pro: true },
    { feature: "Market price tracking", free: true, pro: true },
    { feature: "Rotation Engine", free: "1 daily pick", pro: "Full weighted rotation" },
    { feature: "Weather-aware rotation", free: false, pro: true },
    { feature: "Price history charts", free: false, pro: true },
    { feature: "CSV import & export", free: false, pro: true },
    { feature: "Complete shoe data", free: false, pro: true },
    { feature: "Gallery images", free: false, pro: true },
    { feature: "Custom tags", free: false, pro: true },
    { feature: "Wishlist + price alerts", free: false, pro: true },
    { feature: "Early access features", free: false, pro: true },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-lime-400 font-semibold">Pricing</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Start free, upgrade when ready</h2>
          <p className="mt-4 text-neutral-400 text-lg">No credit card needed to get started.</p>
        </div>
        <div className="mt-16 overflow-hidden rounded-2xl border border-neutral-800">
          <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-900">
            <div className="p-5" />
            <div className="border-l border-neutral-800 p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Free</p>
              <p className="mt-2 text-3xl font-black">£0</p>
              <p className="text-xs text-neutral-500">forever</p>
              <Link href={SIGNIN} className="mt-4 block rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:border-neutral-500 hover:text-white transition text-center">
                Get started
              </Link>
            </div>
            <div className="border-l border-neutral-800 bg-lime-400/5 p-5 text-center">
              <span className="inline-block rounded-full bg-lime-400 px-3 py-0.5 text-xs font-bold text-black whitespace-nowrap">Pro</span>
              <p className="mt-2 text-3xl font-black">£4.99</p>
              <p className="text-xs text-neutral-500">per month · or £39.99/yr</p>
              <Link href={PRICING} className="mt-4 block rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-lime-300 transition text-center">
                Upgrade to Pro
              </Link>
            </div>
          </div>
          {rows.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 ${i < rows.length - 1 ? "border-b border-neutral-800/50" : ""}`}>
              <div className="px-5 py-3.5 text-sm text-neutral-300">{row.feature}</div>
              <div className="flex items-center justify-center border-l border-neutral-800 px-5 py-3.5">
                {typeof row.free === "boolean" ? (
                  row.free ? <span className="text-lime-400"><IconCheck /></span> : <span className="text-neutral-700"><IconMinus /></span>
                ) : (
                  <span className="text-xs font-semibold text-neutral-300">{row.free}</span>
                )}
              </div>
              <div className="flex items-center justify-center border-l border-neutral-800 bg-lime-400/5 px-5 py-3.5">
                {typeof row.pro === "boolean" ? (
                  row.pro ? <span className="text-lime-400"><IconCheck /></span> : <span className="text-neutral-700"><IconMinus /></span>
                ) : (
                  <span className="text-xs font-bold text-lime-400">{row.pro}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ──────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 border-t border-neutral-800">
      {/* Let the fixed backdrop show through with a light overlay */}
      <div className="absolute inset-0 -z-10 bg-neutral-950/70" />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <h2 className="text-4xl font-black sm:text-5xl leading-tight">
          Your collection deserves<br />
          <span className="text-lime-400">better than a spreadsheet.</span>
        </h2>
        <p className="mt-6 text-lg text-neutral-300">
          Join collectors already tracking their kicks with Nextsole. Free to start, no credit card needed.
        </p>
        <Link href={SIGNIN} className="mt-8 inline-block rounded-xl bg-lime-400 px-8 py-4 text-base font-bold text-black hover:bg-lime-300 transition shadow-lg shadow-lime-400/20">
          Start tracking for free →
        </Link>
        <p className="mt-4 text-sm text-neutral-500">Free for up to 5 pairs · Upgrade anytime</p>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Image src="/nextsole-logo.png" alt="Nextsole" width={100} height={28} className="h-6 w-auto opacity-60" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            <Link href={`${APP}/privacy`} className="hover:text-neutral-300 transition">Privacy Policy</Link>
            <Link href={`${APP}/terms`} className="hover:text-neutral-300 transition">Terms of Service</Link>
            <Link href={`${APP}/feedback`} className="hover:text-neutral-300 transition">Feedback</Link>
            <a href="https://www.instagram.com/nextsoleuk" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition">Instagram</a>
            <Link href={SIGNIN} className="hover:text-neutral-300 transition">Sign in</Link>
          </div>
          <p className="text-xs text-neutral-700">© {new Date().getFullYear()} Nextsole · A product of Black Sheep Software</p>
        </div>
      </div>
    </footer>
  );
}

// ── Structured data ────────────────────────────────────────────────────────

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://nextsole.co.uk/#org",
        name: "Nextsole",
        url: "https://nextsole.co.uk",
        logo: "https://nextsole.co.uk/nextsole-logo.png",
        brand: { "@type": "Brand", name: "Black Sheep Software" },
        sameAs: ["https://www.instagram.com/nextsoleuk"],
      },
      {
        "@type": "WebSite",
        "@id": "https://nextsole.co.uk/#website",
        url: "https://nextsole.co.uk",
        name: "Nextsole",
        publisher: { "@id": "https://nextsole.co.uk/#org" },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://app.nextsole.co.uk/collection?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Nextsole",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        url: "https://app.nextsole.co.uk",
        description: "Track, value and manage your sneaker collection. Know what you own, what it's worth, and what to wear next.",
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "4.99",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
          },
        ],
        publisher: { "@id": "https://nextsole.co.uk/#org" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      {/* Fixed backdrop — stays still while content scrolls over it */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/Backdrop.png"
          alt=""
          fill
          className="object-cover object-center opacity-60"
          priority
        />
      </div>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PricingTable />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
