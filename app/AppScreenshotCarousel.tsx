"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SCREENSHOTS = [
  { src: "/app-screenshot.png", alt: "Nextsole — My Collection overview with market value and rotation engine" },
  { src: "/app-screenshot-2.png", alt: "Nextsole — collection grid view" },
  { src: "/app-screenshot-3.png", alt: "Nextsole — shoe detail page with market value and ownership details" },
];

const AUTO_ADVANCE_MS = 4500;

export default function AppScreenshotCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % SCREENSHOTS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      <div className="absolute inset-0 rounded-3xl bg-lime-400/10 blur-3xl -z-10 scale-95" />
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-neutral-800 px-4 py-3">
          {SCREENSHOTS.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              aria-label={`Show screenshot ${i + 1} of ${SCREENSHOTS.length}`}
              onClick={() => setActive(i)}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === active ? "bg-lime-400" : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            />
          ))}
        </div>
        <div className="relative aspect-[960/640]">
          {SCREENSHOTS.map((shot, i) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              priority={i === 0}
              className={`object-cover object-top transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
