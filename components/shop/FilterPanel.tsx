"use client";
import { useState, type ReactNode } from "react";
export default function FilterPanel({
  children,
  activeCount,
}: {
  children: ReactNode;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="shop-filters"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-[#1b1815] px-4 py-4 text-sm font-semibold md:hidden"
      >
        <span>
          Search & filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div
        id="shop-filters"
        className={`${open ? "mt-3 block" : "hidden"} md:mt-0 md:block`}
      >
        {children}
      </div>
    </div>
  );
}
