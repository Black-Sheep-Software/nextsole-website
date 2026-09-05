import Image from "next/image";
import Link from "next/link";

const APP = "https://app.nextsole.co.uk";
const SIGNIN = `${APP}/login`;
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.blacksheepsoftware.nextsole";

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Extracted from app/page.tsx's original inline Footer() so /blog pages get
// the exact same footer without duplicating it — this component itself has
// no homepage-specific coupling (unlike the homepage's own Nav, which is
// full of #section anchors and stays local to that page).
export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <Image src="/nextsole-logo.png" alt="Nextsole" width={100} height={28} className="h-6 w-auto opacity-60" />
            <a
              href="https://www.instagram.com/nextsoleuk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nextsole on Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition hover:border-lime-400/50 hover:text-lime-400"
            >
              <IconInstagram />
            </a>
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" aria-label="Get Nextsole on Google Play">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-8 w-auto opacity-60 transition hover:opacity-100"
              />
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            <Link href="/blog" className="hover:text-neutral-300 transition">Blog</Link>
            <Link href={`${APP}/privacy`} className="hover:text-neutral-300 transition">Privacy Policy</Link>
            <Link href={`${APP}/terms`} className="hover:text-neutral-300 transition">Terms of Service</Link>
            <Link href={`${APP}/feedback`} className="hover:text-neutral-300 transition">Feedback</Link>
            <Link href={SIGNIN} className="hover:text-neutral-300 transition">Sign in</Link>
          </div>
          <p className="text-xs text-neutral-700">© {new Date().getFullYear()} Nextsole · A product of Black Sheep Software</p>
        </div>
      </div>
    </footer>
  );
}
