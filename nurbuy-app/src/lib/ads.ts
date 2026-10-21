import { api } from '@/api/api';

import { visitorId } from './visitor';

/** Last impression per campaign: one view per campaign every 30 minutes, like the website. */
const seen = new Map<number, number>();
const VIEW_GAP = 30 * 60 * 1000;

async function send(c: number, k: 'i' | 'c') {
  try {
    await api('POST', '/ads/ev', { body: { c, k, v: await visitorId() } });
  } catch {
    // ad counting never disturbs the customer
  }
}

/** The sponsored card was at least 60% on screen. */
export function adSeen(c: number) {
  const now = Date.now();
  const last = seen.get(c);
  if (last && now - last < VIEW_GAP) return;
  seen.set(c, now);
  void send(c, 'i');
}

/** The customer tapped the sponsored card (the server counts a click only after a view). */
export function adClicked(c: number) {
  if (!seen.has(c)) adSeen(c);
  setTimeout(() => void send(c, 'c'), 150);
}
