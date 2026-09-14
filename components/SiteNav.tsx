import Image from "next/image";
import Link from "next/link";

const SIGNIN = "https://app.nextsole.co.uk/login";

// A lighter nav for content pages (blog) — the homepage's own Nav has
// #section anchors that only make sense there, so this stays a separate,
// simpler component rather than overloading that one with page-awareness.
export default function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/">
          <Image src="/nextsole-logo.png" alt="Nextsole" width={120} height={34} className="h-7 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Page sections">
          <Link href="/blog" className="text-sm font-semibold text-neutral-400 hover:text-white transition">Blog</Link>
          <Link href="/#pricing" className="text-sm font-semibold text-neutral-400 hover:text-white transition">Pricing</Link>
          <Link href="/faq" className="text-sm font-semibold text-neutral-400 hover:text-white transition">FAQ</Link>
        </nav>
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
