import { useQuery } from '@tanstack/react-query';

import { checkCoupon } from '@/api/orders';

import type { CartItem } from './cart';

/** Server check of the cart's coupon against the current lines; the discount is 0 while unchecked or invalid. */
export function useCouponDiscount(code: string, items: CartItem[]) {
  const lines = items.filter((i) => i.p).map((i) => ({ id: i.line.id, unit: i.unit, q: i.line.q, shop: i.shop }));
  const sig = lines.map((l) => `${l.id}:${l.unit}:${l.q}`).join(',');
  const q = useQuery({
    queryKey: ['coupon', code, sig],
    queryFn: () => checkCoupon(code, lines),
    enabled: !!code && lines.length > 0,
    retry: false,
    staleTime: 60_000,
  });
  return { discount: q.data?.discount ?? 0, error: q.error, loading: q.isFetching };
}
