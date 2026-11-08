import { shopApiOrigin } from "@/lib/shopServerConfig";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (
    !uuid.test(body?.attemptId ?? "") ||
    !Array.isArray(body?.listingIds) ||
    body.listingIds.length < 1 ||
    body.listingIds.length > 10 ||
    !body.listingIds.every(
      (id: unknown) => typeof id === "string" && uuid.test(id),
    ) ||
    new Set(body.listingIds).size !== body.listingIds.length
  )
    return NextResponse.json(
      { error: "Invalid basket. Maximum 10 pairs." },
      { status: 400 },
    );
  const jar = await cookies();
  const cookieName = `nextsole_checkout_${body.attemptId}`;
  const existing = jar.get(cookieName)?.value;
  // Establish the HttpOnly credential before reserving stock. If this first
  // response is lost, no provider session exists and preparation can be retried.
  if (!existing || !/^[a-f0-9]{64}$/.test(existing)) {
    jar.set(cookieName, randomBytes(32).toString("hex"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/shop",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json(
      { prepared: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  const token = existing;
  try {
    const res = await fetch(`${shopApiOrigin()}/api/public/shop/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shop-secret": process.env.SHOP_API_SECRET ?? "",
      },
      body: JSON.stringify({
        attemptId: body.attemptId,
        listingIds: body.listingIds,
        token,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });
    return NextResponse.json(await res.json(), {
      status: res.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Checkout is being checked. Retry shortly using the same cart.",
      },
      { status: 503 },
    );
  }
}
