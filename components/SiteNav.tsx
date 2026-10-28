import Image from "next/image";
import Link from "next/link";

const SIGNIN = "https://app.nextsole.co.uk/login";
const SHOP = "https://nextsole.teemill.com/";

// Single shared nav for every page, including the homepage switchboard.
// Previously the homepage had its own inline Nav() with #section anchors
// while every other page used this component — they drifted apart before
// (Blog vanished from one) and had to be reconciled by hand during a merge.
// Now there's exactly one nav, matching the switchboard IA: Sneakers | App | Shop.
export default function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 xl:px-12">
        <Link href="/">
          <Image src="/nextsole-logo.png" alt="Nextsole" width={120} height={34} className="h-7 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <Link href="/sneakers" className="text-sm font-semibold text-neutral-400 hover:text-white transition">Sneakers</Link>
          <Link href="/app" className="text-sm font-semibold text-neutral-400 hover:text-white transition">App</Link>
          <Link href={SHOP} className="text-sm font-semibold text-neutral-400 hover:text-white transition">Shop</Link>
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
