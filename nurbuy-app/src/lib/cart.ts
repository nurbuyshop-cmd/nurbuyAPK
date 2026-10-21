import type { Product, Store, Variant } from '@/api/catalog';
import type { CartLine } from '@/store/cart';
import { lineKey } from '@/store/cart';

import { qtyLimit, shopState, type CatalogIndex } from './products';

export type CartItem = {
  key: string;
  line: CartLine;
  /** undefined when the product is no longer sold (or its shop does not deliver here) */
  p: Product | undefined;
  v: Variant | null;
  unit: number;
  shop: string;
  store: Store | undefined;
  closed: boolean;
  outOfStock: boolean;
  max: number;
};

/** Cart lines with live prices, options, stock and shop state. */
export function cartItems(lines: Record<string, CartLine>, idx: CatalogIndex): CartItem[] {
  return Object.values(lines).map((line) => {
    const p = idx.byId.get(line.id);
    const v = p?.vr ? p.vr.list.find((x) => x.id === line.vid) ?? null : null;
    const store = p ? idx.storeByName.get(p.sh) : undefined;
    return {
      key: lineKey(line.id, line.vid),
      line,
      p,
      v,
      unit: v ? v.price : p?.pr ?? 0,
      shop: p?.sh ?? '',
      store,
      closed: !!p && !shopState(store).open,
      // a product with options needs a valid option
      outOfStock: !p || (p.vr ? !v || v.stock <= 0 : p.stockOn && p.st <= 0),
      max: p ? qtyLimit(p, v) : 0,
    };
  });
}

export type Totals = { sub: number; shops: number; fee: number; cod: number; disc: number; total: number; free: boolean; left: number };

/**
 * Same rule as the server: free delivery from the free amount, else the charge per shop; COD adds its charge.
 * In zones mode the server's quote for this cart already holds the final charge.
 */
export function cartTotals(
  items: CartItem[],
  o: { fee: number; freeAbove: number | null; zoneFee: number | null; codFee: number; pay: 'cod' | 'wallet' | 'online'; disc: number },
): Totals {
  const ok = items.filter((i) => i.p);
  const sub = round(ok.reduce((a, i) => a + i.unit * i.line.q, 0));
  const shops = Math.max(1, new Set(ok.map((i) => i.shop)).size);
  const free = o.freeAbove !== null && sub >= o.freeAbove;
  const fee = !ok.length ? 0 : o.zoneFee !== null ? o.zoneFee : free ? 0 : round(o.fee * shops);
  const cod = o.pay === 'cod' && ok.length ? o.codFee : 0;
  const disc = Math.min(o.disc, sub);
  return { sub, shops, fee, cod, disc, total: round(sub - disc + fee + cod), free: fee === 0 && ok.length > 0, left: o.freeAbove === null ? 0 : Math.max(0, o.freeAbove - sub) };
}

const round = (n: number) => Math.round(n * 100) / 100;
