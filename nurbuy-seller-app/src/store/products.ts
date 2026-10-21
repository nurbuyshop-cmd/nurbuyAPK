import { create } from 'zustand';

import * as P from '@/api/products';
import type { Meta, Product, ProductCounts } from '@/api/products';

import { useAuth } from './auth';

export type PFilter = 'all' | 'active' | 'pending' | 'rejected' | 'hidden' | 'low';

type State = {
  list: Product[] | null;
  counts: ProductCounts | null;
  error: unknown;
  filter: PFilter;
  q: string;
  meta: Meta | null;
  load: () => Promise<void>;
  /** Puts a changed product into the list at once (stock, hide/show, save). */
  put: (p: Product) => void;
  drop: (id: number) => void;
  setFilter: (f: PFilter) => void;
  setQ: (q: string) => void;
  loadMeta: () => Promise<Meta>;
};

/** The seller's products (kept while the app is open, like the website's pcache) and the category / attribute lists. */
export const useProducts = create<State>((set, get) => ({
  list: null,
  counts: null,
  error: null,
  filter: 'all',
  q: '',
  meta: null,

  load: async () => {
    try {
      const d = await P.products();
      set({ list: d.products, counts: d.counts, error: null });
    } catch (e) {
      set({ error: e });
    }
  },

  put: (p) => {
    const list = get().list;
    if (!list) return;
    const has = list.some((x) => x.id === p.id);
    set({ list: has ? list.map((x) => (x.id === p.id ? p : x)) : [p, ...list] });
  },

  drop: (id) => {
    const list = get().list;
    if (list) set({ list: list.filter((x) => x.id !== id) });
  },

  setFilter: (filter) => set({ filter }),
  setQ: (q) => set({ q }),

  loadMeta: async () => {
    const m = get().meta;
    if (m) return m;
    const meta = await P.meta();
    set({ meta });
    return meta;
  },
}));

// a different seller on this phone must never see the previous shop's products
useAuth.subscribe((s, p) => {
  if (s.token !== p.token) useProducts.setState({ list: null, counts: null, error: null, meta: null, filter: 'all', q: '' });
});

/** Products shown by the current filter and search (website pMatch()). */
export function matches(p: Product, f: PFilter, q: string): boolean {
  let ok = true;
  if (f === 'active') ok = p.status === 'active' && !p.hidden;
  else if (f === 'hidden') ok = p.status === 'active' && p.hidden;
  else if (f === 'low') ok = p.status === 'active' && p.stock_on && p.stock <= 5;
  else if (f === 'pending') ok = p.status === 'pending' || (p.status === 'active' && !!p.chg);
  else if (f === 'rejected') ok = p.status === 'rejected';
  if (ok && q) ok = `${p.name} ${p.bn}`.toLowerCase().includes(q.toLowerCase());
  return ok;
}
