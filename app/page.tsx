import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const SHOP = "https://nextsole.teemill.com/";

export const metadata: Metadata = {
  title: "Nextsole — The Home For Sneaker Collectors",
  description: "Nextsole is where sneaker collectors track their collection's market value, follow release news, and shop real branded merch.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://nextsole.co.uk",
    siteName: "Nextsole",
    title: "Nextsole — The Home For Sneaker Collectors",
    description: "Nextsole is where sneaker collectors track their collection's market value, follow release news, and shop real branded merch.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nextsole" }],
  },
};

// ── Structured data ────────────────────────────────────────────────────────
// Describes the site itself, not the app product — that schema lives on
// /app now, which is what the SoftwareApplication entity actually is.

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
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Switchboard cards ──────────────────────────────────────────────────────

type Card = {
  index: string;
  label: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  content: React.ReactNode;
};

function IconApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" />
    </svg>
  );
}

function IconSneakers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </svg>
  );
}

function IconShop() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2l1.5 4h9L18 2M3.5 6h17l-1.2 13.2a2 2 0 0 1-2 1.8H6.7a2 2 0 0 1-2-1.8L3.5 6z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function CARDS(): Card[] {
  return [
    {
      index: "01",
      label: "App",
      href: "/app",
      icon: <IconApp />,
      title: "Track your collection",
      body: "Nextsole tracks your collection's market value and wear history, and gives you a daily pick that actually knows your shoes.",
      cta: "Open the app →",
      content: (
        <div className="mt-auto rounded-[14px] border border-white/[0.06] bg-[#14120F] p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-lime-400/10">
              <IconClock />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-[12.5px] font-bold text-[#F2EDE4]">Today&apos;s Pick</p>
              <p className="m-0 mt-px truncate text-[11.5px] text-[#6b665f]">Rotation-aware, every morning</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      index: "02",
      label: "Sneakers",
      href: "/sneakers",
      icon: <IconSneakers />,
      title: "News, releases & the archive",
      body: "Nextsole covers live sneaker news, what's releasing next, and a full release-history database going back years.",
      cta: "Explore →",
      content: (
        <div className="mt-auto flex flex-wrap gap-2">
          {["Latest News", "Coming Soon", "Full Database"].map((chip) => (
            <span key={chip} className="inline-flex items-center rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-[#cfc9bd]">
              {chip}
            </span>
          ))}
        </div>
      ),
    },
    {
      index: "03",
      label: "Shop",
      href: SHOP,
      external: true,
      icon: <IconShop />,
      title: "Nextsole merch",
      body: "Nextsole sells real tees and hoodies, made for people who live and breathe sneaker culture.",
      cta: "Shop now →",
      content: (
        <div className="mt-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
            <span className="text-[13px] font-semibold text-[#F2EDE4]">The Original Tee</span>
            <span className="text-[13px] font-bold text-lime-400">£24</span>
          </div>
          <div className="flex items-center justify-between rounded-[10px] border border-white/[0.06] bg-[#14120F] px-3 py-2.5">
            <span className="text-[13px] font-semibold text-[#F2EDE4]">Original Hoodie</span>
            <span className="text-[13px] font-bold text-lime-400">£45</span>
          </div>
        </div>
      ),
    },
  ];
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  const cards = CARDS();

  return (
    <>
      <JsonLd />
      <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]">
        {/* Fixed backdrop — pinned while the page scrolls over it, same
            effect as the live site's root-level backdrop layer. */}
        <div className="fixed inset-0 -z-10">
          <Image src="/Backdrop.png" alt="" fill className="object-cover object-center opacity-60" priority />
        </div>

        <SiteNav />

        <main>
          <section className="relative flex min-h-[620px] items-center overflow-hidden pt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#14120F] via-[#14120F]/75 to-[#14120F]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14120F] via-transparent to-[#14120F]/30" />
            <div className="relative mx-auto w-full max-w-[1500px] px-4 py-16 sm:px-6 xl:px-12">
              <div className="max-w-xl">
                <p className="m-0 text-[13px] font-bold uppercase tracking-[0.3em] text-lime-400">Nextsole</p>
                <h1 className="mt-4 text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl">
                  The home for sneaker<br />
                  <span className="inline-block -skew-x-[10deg] text-lime-400">collectors.</span>
                </h1>
                <p className="mt-4 text-base font-bold text-[#cfc9bd]">Track it. Follow it. Wear it — three ways in.</p>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[#9a958c]">
                  Nextsole is where sneaker collectors track their collection&apos;s market value, follow release news, and shop real branded merch.
                </p>
              </div>
            </div>
          </section>

          <section className="relative mx-auto grid max-w-[1312px] gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-3 xl:px-12">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="group flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#1B1815] p-7 transition hover:-translate-y-0.5 hover:border-lime-400"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/[0.12]">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6b665f]">
                    {card.index} · {card.label}
                  </span>
                </div>
                <div>
                  <h2 className="m-0 text-[23px] font-extrabold">{card.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#9a958c]">{card.body}</p>
                </div>
                {card.content}
                <span className="text-sm font-bold text-lime-400">{card.cta}</span>
              </Link>
            ))}
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
