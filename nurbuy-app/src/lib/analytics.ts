import { API_BASE } from '@/config';
import { useAuth } from '@/store/auth';
import { trackingAllowed, useConsent } from '@/store/consent';

import { sessionId, visitorId } from './visitor';

export type TrackEvent = 'visit' | 'view' | 'cart' | 'checkout' | 'ping' | 'page' | 'click';
export type TrackPage = 'home' | 'shop' | 'product' | 'category' | 'cart' | 'checkout' | 'orders' | 'account' | 'search' | 'policy' | 'other';

/**
 * Visitor analytics beacon (POST /t), like the website.
 * Without consent only the anonymous event is sent (no "c", no login); with consent "c":1 and the login token link the visit
 * to the customer. Failures are ignored.
 */
export async function track(e: TrackEvent, x: { p?: string; pg?: TrackPage; cat?: string; pn?: string } = {}): Promise<void> {
  try {
    const allowed = trackingAllowed(useConsent.getState());
    const body: Record<string, string | number> = { v: await visitorId(), s: sessionId, e, w: 'min' };
    if (allowed) body.c = 1;
    if (x.p) body.p = x.p.slice(0, 40);
    if (x.pg) body.pg = x.pg;
    // product and category names are kept only with consent
    if (allowed && x.cat) body.cat = x.cat.slice(0, 80);
    if (allowed && x.pn) body.pn = x.pn.slice(0, 120);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const tok = useAuth.getState().token;
    if (allowed && tok) headers.Authorization = `Bearer ${tok}`;
    await fetch(`${API_BASE}/t`, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    // analytics never disturbs the customer
  }
}

/** Screen name for a route path. */
export function pageOf(path: string): TrackPage {
  if (path === '/' ) return 'home';
  if (path.startsWith('/product') || path.startsWith('/reviews')) return 'product';
  if (path.startsWith('/shop')) return 'shop';
  if (path === '/category' || path.startsWith('/products')) return 'category';
  if (path === '/cart') return 'cart';
  if (path === '/checkout') return 'checkout';
  if (path.startsWith('/order')) return 'orders';
  if (path === '/profile' || path === '/wallet' || path === '/wishlist' || path === '/auth') return 'account';
  if (path === '/search' || path === '/photo-search') return 'search';
  if (path.startsWith('/page')) return 'policy';
  return 'other';
}
