import Image from "next/image";
import Link from "next/link";
import type { BlogBlock } from "@/lib/blogTypes";

// Maps the shared block schema to this site's own design system, rather
// than reusing the main app's email-oriented HTML renderer (inline styles
// meant for email clients, not a Tailwind-styled public page).
function renderBlock(block: BlogBlock) {
  const align = "align" in block && block.align === "left" ? "text-left" : "text-center";

  switch (block.type) {
    case "eyebrow":
      return block.text ? (
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] text-lime-400 ${align}`}>{block.text}</p>
      ) : null;
    case "heading":
      return block.text ? (
        <h2 className={`mt-3 text-2xl font-black sm:text-3xl ${align}`}>{block.text}</h2>
      ) : null;
    case "text":
      return block.text ? (
        <p className={`mt-4 whitespace-pre-line text-base leading-relaxed text-neutral-300 ${align}`}>{block.text}</p>
      ) : null;
    case "image":
      return block.url ? (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl">
          <Image src={block.url} alt={block.alt || ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      ) : null;
    case "button":
      return block.text && block.url ? (
        <div className="mt-6 text-center">
          <Link href={block.url} className="inline-block rounded-xl bg-lime-400 px-7 py-3 text-sm font-bold text-black transition hover:bg-lime-300">
            {block.text}
          </Link>
        </div>
      ) : null;
    case "divider":
      return <hr className="my-8 border-neutral-800" />;
    case "spacer":
      return <div className="h-8" />;
    case "author":
      return (
        <div className={`mt-4 flex items-center gap-3 ${align === "text-left" ? "" : "justify-center"}`}>
          {block.avatarUrl && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src={block.avatarUrl} alt={block.name} fill className="object-cover" sizes="40px" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{block.name}</p>
            {block.role && <p className="text-xs text-neutral-500">{block.role}</p>}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogBlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return <div>{(blocks ?? []).map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</div>;
}
