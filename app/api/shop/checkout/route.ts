import { NextResponse } from "next/server";

// Same spirit as app/api/revalidate/route.ts — the one other server route
// this repo has of its own. Relays the cart to the main app's checkout
// endpoint server-to-server (no CORS, no Stripe keys here) and passes its
// response straight back, same status code either way (200 with a Stripe
// url, or 409 naming what just sold out).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.listingIds) {
    return NextResponse.json({ error: "listingIds required" }, { status: 400 });
  }

  const res = await fetch("https://app.nextsole.co.uk/api/public/shop/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-shop-secret": process.env.SHOP_API_SECRET ?? "" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({ error: "Checkout failed" }));
  return NextResponse.json(json, { status: res.status });
}
