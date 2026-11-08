"use client";
import Image from "next/image";
import { useRef, useState } from "react";
export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  if (!images.length)
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#e9e6e0] text-sm text-neutral-600">
        Photos of this pair coming soon
      </div>
    );
  function move(by: number) {
    setActive((i) => (i + by + images.length) % images.length);
  }
  return (
    <div className="space-y-3">
      <button
        onClick={() => dialog.current?.showModal()}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#e9e6e0]"
        aria-label={`Enlarge photo ${active + 1} of ${title}`}
      >
        <Image
          src={images[active]}
          alt={`${title}, photo ${active + 1}`}
          fill
          unoptimized
          sizes="(max-width:768px) 100vw,55vw"
          className="object-contain p-5 md:p-9"
          priority
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-2 text-[10px] font-semibold text-black">
          ⤢ Expand photo
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-[10px] text-black">
          {active + 1} / {images.length}
        </span>
      </button>
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Pair photographs"
        >
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#e9e6e0] ${active === i ? "border-lime-400" : "border-transparent hover:border-white/40"}`}
            >
              <Image
                src={url}
                alt=""
                fill
                unoptimized
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-[#aaa49a]">
        Photos of this individual pair. Select a photo to take a closer look.
      </p>
      <dialog
        ref={dialog}
        aria-label={`Photos of ${title}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        className="fixed inset-0 m-auto h-[90dvh] max-h-[950px] w-[95vw] max-w-5xl rounded-2xl bg-[#e9e6e0] p-0 backdrop:bg-black/85"
      >
        <div className="relative h-full">
          <Image
            src={images[active]}
            alt={`${title}, enlarged photo ${active + 1}`}
            fill
            unoptimized
            sizes="95vw"
            className="object-contain p-10"
          />
          <button
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close enlarged photo"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black text-xl text-white"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={() => move(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 h-11 w-11 rounded-full bg-black text-white"
              >
                ←
              </button>
              <button
                onClick={() => move(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 h-11 w-11 rounded-full bg-black text-white"
              >
                →
              </button>
            </>
          )}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-xs text-white">
            {active + 1} / {images.length}
          </span>
        </div>
      </dialog>
    </div>
  );
}
