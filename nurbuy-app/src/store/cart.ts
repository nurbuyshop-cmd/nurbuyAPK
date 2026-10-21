import { create } from 'zustand';

import { isObj, isStr, num, str } from '@/lib/guards';
import { local } from '@/lib/storage';

const KEY = 'nb_cart';
const CPN_KEY = 'nb_cart_cpn';

export type CartLine = { id: string; vid: string; q: number };

export const lineKey = (id: string, vid: string) => `${id}|${vid}`;

const isLines = (v: unknown): v is Record<string, CartLine> =>
  isObj(v) && Object.values(v).every((x) => isObj(x) && typeof x.id === 'string' && typeof x.vid === 'string' && typeof x.q === 'number');

type State = {
  /** "productId|variantId" -> line; prices are always read from the live catalog */
  lines: Record<string, CartLine>;
  /** one coupon code per cart (like the website), checked with the server before use */
  coupon: string;
  setCoupon: (code: string) => void;
  hydrate: () => Promise<void>;
  /** sets the quantity of a product (and option); 0 removes it */
  setQty: (id: string, vid: string, q: number) => void;
  /** removes the given lines (after an order) */
  removeLines: (keys: string[]) => void;
};

export const useCart = create<State>((set, get) => ({
  lines: {},
  coupon: '',
  setCoupon: (coupon) => {
    set({ coupon });
    void local.set(CPN_KEY, coupon);
  },
  hydrate: async () => {
    const cpn = await local.get(CPN_KEY, isStr);
    if (cpn) set({ coupon: cpn });
    const saved = await local.get(KEY, isLines);
    if (saved) {
      const clean: Record<string, CartLine> = {};
      for (const l of Object.values(saved)) {
        const id = str(l.id);
        const q = Math.floor(num(l.q));
        if (id && q > 0) clean[lineKey(id, l.vid)] = { id, vid: l.vid, q };
      }
      set({ lines: clean });
    }
  },
  setQty: (id, vid, q) => {
    const lines = { ...get().lines };
    const k = lineKey(id, vid);
    if (q > 0) lines[k] = { id, vid, q: Math.floor(q) };
    else delete lines[k];
    set({ lines });
    void local.set(KEY, lines);
  },
  removeLines: (keys) => {
    const lines = { ...get().lines };
    keys.forEach((k) => delete lines[k]);
    set({ lines });
    void local.set(KEY, lines);
  },
}));

/** Number of different products in the cart (the website's badge counts lines, not units). */
export const cartCount = (s: Pick<State, 'lines'>) => Object.keys(s.lines).length;
