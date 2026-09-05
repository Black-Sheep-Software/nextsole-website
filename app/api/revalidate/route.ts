import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called by the main app (nextsole) whenever a blog post's publish state or
// published content changes -- publish, unpublish, delete, or an edit to an
// already-published post. Without this, a mistake stays live until the ISR
// window (5 min) naturally expires, and a bad enough cache-timing collision
// (seen once already) can leave it stuck well past that until a redeploy
// forces a fresh build. This makes "fix a mistake" near-instant instead.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("Authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await request.json().catch(() => ({}));

  revalidatePath("/blog");
  if (typeof slug === "string" && slug) revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ revalidated: true, slug: slug ?? null });
}
