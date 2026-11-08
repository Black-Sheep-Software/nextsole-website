import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const attemptId = new URL(request.url).searchParams.get('attempt');
  if (!attemptId || !/^[0-9a-f-]{36}$/i.test(attemptId)) return NextResponse.json({error:'Invalid checkout'}, {status:400});
  const token = (await cookies()).get(`nextsole_checkout_${attemptId}`)?.value;
  if (!token) return NextResponse.json({error:'Open this confirmation in the browser used for checkout.'}, {status:403});
  try {
    const res = await fetch('https://app.nextsole.co.uk/api/public/shop/status', {method:'POST', headers:{'Content-Type':'application/json','x-shop-secret':process.env.SHOP_API_SECRET ?? ''}, body:JSON.stringify({attemptId,token}), cache:'no-store', signal:AbortSignal.timeout(15000)});
    return NextResponse.json(await res.json(), {status:res.status, headers:{'Cache-Control':'no-store'}});
  } catch { return NextResponse.json({error:'Status is temporarily unavailable.'}, {status:503}); }
}
