import { shopApiOrigin } from "@/lib/shopServerConfig";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const response = await fetch(`${shopApiOrigin()}/api/public/shop/config`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Unavailable");
    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({
      checkoutEnabled: false,
      shippingPence: null,
      currency: "GBP",
    });
  }
}
