"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/lib/cart/CartContext';

type Status = {state:string;orderId?:string;status?:string;totalPence?:number;trackingNumber?:string;trackingCarrier?:string;listingIds?:string[]};
export default function ShopSuccessPage() {
  const { removeItems } = useCart();
  const [status,setStatus] = useState<Status | null>(null);
  const [error,setError] = useState('');
  const stopped = useRef(false);
  const checking = useRef(false);
  const check = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    const attempt = new URLSearchParams(window.location.search).get('attempt');
    if (!attempt) { setError('No checkout was supplied. Your cart has been kept.'); stopped.current = true; checking.current = false; return; }
    try {
      const response = await fetch(`/api/shop/status?attempt=${encodeURIComponent(attempt)}`, {cache:'no-store'});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to check your order.');
      setStatus(result);setError('');
      if (['confirmed','expired'].includes(result.state)) stopped.current = true;
      if (result.state === 'confirmed' && Array.isArray(result.listingIds)) removeItems(result.listingIds);
    } catch(e) {setError(e instanceof Error ? e.message : 'Unable to check your order.');}
    finally { checking.current = false; }
  }, [removeItems]);
  useEffect(() => { void check(); const timer = window.setInterval(() => { if (!stopped.current) void check(); },5000); return () => window.clearInterval(timer); }, [check]);
  const confirmed = status?.state === 'confirmed';
  return <div className="min-h-screen bg-[#14120F] text-[#F2EDE4]"><SiteNav />
    <main className="mx-auto max-w-[600px] px-4 pb-24 pt-32 text-center" aria-live="polite">
      <h1 className="text-3xl font-black">{confirmed ? status.status === 'refunded' ? 'Your order was refunded' : 'Your order is confirmed' : status?.state === 'expired' ? 'Checkout expired' : error ? 'Check your order' : 'Checking your payment…'}</h1>
      {confirmed ? <div className="mt-5 space-y-3 text-[#cfc9bd]"><p>Order reference: {status.orderId?.slice(0,8).toUpperCase()}</p><p>Total: £{((status.totalPence ?? 0)/100).toFixed(2)}</p><p>{status.trackingNumber ? `${status.trackingCarrier ?? 'Tracking'}: ${status.trackingNumber}` : status.status === 'paid' ? 'We’ll email your receipt and send tracking once your pair is dispatched.' : `Order status: ${status.status}`}</p></div> : <p className="mt-4 text-[#9a958c]">{error || (status?.state === 'expired' ? 'No order was confirmed. Your cart has been kept.' : 'Payment confirmation can take a moment. Keep this page open; please do not pay again while we check.')}</p>}
      {error && <button onClick={() => void check()} className="mt-5 rounded-xl border border-white/20 px-4 py-2">Check again</button>}
      <Link href="/shop" className="mt-8 inline-block text-lime-400">Back to shop</Link>
    </main><SiteFooter /></div>;
}
