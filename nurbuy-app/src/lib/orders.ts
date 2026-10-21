import { useQuery } from '@tanstack/react-query';

import { myOrders, type Order } from '@/api/orders';
import type { StringKey } from '@/i18n/en';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';

import type { CatalogIndex } from './products';

const CLOSED = ['Delivered', 'Cancelled', 'Failed', 'Refunded', 'Returned'];

export const isActive = (o: Order) => !CLOSED.includes(o.status);
export const isCancelled = (o: Order) => ['Cancelled', 'Failed', 'Refunded', 'Returned'].includes(o.status);

/** Tracker steps shown to the customer (the website's four steps). */
export const STEPS: StringKey[] = ['stPlaced', 'stPacked', 'stOnWay', 'stDelivered'];

/** Index of the reached step: Pending/Confirmed = placed, Packed, Out for delivery = on the way, Delivered. */
export function stepOf(o: Order): number {
  switch (o.status) {
    case 'Packed':
      return 1;
    case 'Out for delivery':
      return 2;
    case 'Delivered':
      return 3;
    default:
      return 0;
  }
}

export function statusLabel(o: Order): StringKey {
  switch (o.status) {
    case 'Confirmed':
      return 'stConfirmed';
    case 'Packed':
      return 'stPacked';
    case 'Out for delivery':
      return 'stOnWay';
    case 'Delivered':
      return 'stDelivered';
    case 'Returned':
      return 'stReturned';
    case 'Cancelled':
    case 'Failed':
    case 'Refunded':
      return 'stCancelled';
    default:
      return 'stPlaced';
  }
}

/** Minutes left until the promised time, using the server clock offset; null when the order is not counting down. */
export function minutesLeft(o: Order, nowMs: number, skew: number): number | null {
  if (!o.eta || !isActive(o)) return null;
  return Math.ceil((o.eta.due - (nowMs + skew)) / 60000);
}

/** The customer's orders; refreshed every 30 s while one is still on its way. */
export function useOrders() {
  const status = useAuth((s) => s.status);
  return useQuery({
    queryKey: ['orders'],
    queryFn: myOrders,
    enabled: status === 'user',
    refetchInterval: (q) => (q.state.data?.some(isActive) ? 30_000 : false),
  });
}

/** Puts the same products and quantities back in the cart; returns [added, skipped]. */
export function orderAgain(o: Order, idx: CatalogIndex): [number, number] {
  const cart = useCart.getState();
  let add = 0;
  let skip = 0;
  for (const it of o.items) {
    const p = idx.byId.get(it.id);
    if (!p) {
      skip++;
      continue;
    }
    if (p.vr) {
      const v = p.vr.list.find((x) => x.id === it.vid);
      if (!v || v.stock <= 0) {
        skip++;
        continue;
      }
      cart.setQty(p.id, v.id, Math.min(it.q, v.stock, p.maxQ || 99));
    } else {
      if (p.stockOn && p.st <= 0) {
        skip++;
        continue;
      }
      cart.setQty(p.id, '', Math.min(it.q, p.stockOn ? p.st : 99, p.maxQ || 99));
    }
    add++;
  }
  return [add, skip];
}
