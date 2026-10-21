import type { Catalog, Category, Product, Store, Variant } from '@/api/catalog';
import type { Lang } from '@/store/i18n';

import { isOpen, nextOpen } from './time';

export const NEW_MAX = 18;

export type Badge =
  | { k: 'left'; n: number }
  | { k: 'sellingOut' }
  | { k: 'best' }
  | { k: 'rank'; n: number; cat: string; catBn: string }
  | { k: 'sold'; n: number };

export type CatalogIndex = {
  all: Product[];
  byId: Map<string, Product>;
  storeByName: Map<string, Store>;
  storeById: Map<string, Store>;
  catById: Map<number, Category>;
  /** discounted products, newest first (the website's Hot Deals) */
  hot: Product[];
  /** the rest, newest first (Best Selling) */
  best: Product[];
  /** newest first, only products with a known added time */
  newest: Product[];
  badges: Map<string, Badge>;
  /** shops that deliver to the chosen place */
  stores: Store[];
};

const cache = new WeakMap<Catalog, Map<string, CatalogIndex>>();

/** A shop with a coverage list reaches the customer only when one of the chosen places (district, thana or village) is in it. */
export function shopReaches(s: Store | undefined, sel: number[]): boolean {
  if (!s || !s.cov.length || !sel.length) return true;
  return sel.some((id) => s.cov.includes(id));
}

/** Derived lists for one catalog document and chosen place (computed once per pair). */
export function indexCatalog(c: Catalog, sel: number[] = []): CatalogIndex {
  const key = sel.join('.');
  let per = cache.get(c);
  if (!per) {
    per = new Map();
    cache.set(c, per);
  }
  const hit = per.get(key);
  if (hit) return hit;
  const stores = c.stores.filter((s) => shopReaches(s, sel));
  const storeByName = new Map(stores.map((s) => [s.n, s]));
  const storeById = new Map(stores.map((s) => [s.id, s]));
  const hidden = new Set(c.stores.filter((s) => !storeByName.has(s.n)).map((s) => s.n));
  const all = c.products.filter((p) => !hidden.has(p.sh));
  const byId = new Map(all.map((p) => [p.id, p]));
  const catById = new Map<number, Category>();
  const walk = (cs: Category[]) => cs.forEach((x) => { catById.set(x.id, x); walk(x.subs); });
  walk(c.cats);
  // the website lists the newest catalog entries first
  const rev = [...all].reverse();
  const idx: CatalogIndex = {
    all,
    byId,
    storeByName,
    storeById,
    catById,
    hot: rev.filter((p) => p.old > p.pr),
    best: rev.filter((p) => !(p.old > p.pr)),
    newest: all.filter((p) => p.ts > 0).sort((a, b) => b.ts - a.ts).slice(0, NEW_MAX),
    badges: computeBadges(all),
    stores,
  };
  per.set(key, idx);
  return idx;
}

/**
 * One honest badge per product, from real numbers only: low stock first, then the best sellers of the last 30 days,
 * the top 3 of a category, and a rounded "sold recently" count.
 */
function computeBadges(all: Product[]): Map<string, Badge> {
  const out = new Map<string, Badge>();
  const bySales = [...all].filter((p) => p.s30 > 0).sort((a, b) => b.s30 - a.s30);
  const top = new Set(bySales.filter((p) => p.s30 >= 5).slice(0, 3).map((p) => p.id));
  const catRank = new Map<string, number>();
  const perCat = new Map<number, Product[]>();
  for (const p of bySales) {
    if (!p.cid) continue;
    const l = perCat.get(p.cid) ?? [];
    l.push(p);
    perCat.set(p.cid, l);
  }
  const catSize = new Map<number, number>();
  for (const p of all) if (p.cid) catSize.set(p.cid, (catSize.get(p.cid) ?? 0) + 1);
  perCat.forEach((l, cid) => {
    if ((catSize.get(cid) ?? 0) < 3) return;
    l.slice(0, 3).forEach((p, i) => { if (p.s30 >= 3) catRank.set(p.id, i + 1); });
  });

  for (const p of all) {
    const stock = totalStock(p);
    if (p.stockOn && stock > 0 && stock <= 5) out.set(p.id, { k: 'left', n: stock });
    else if (p.stockOn && stock > 0 && stock <= 15 && p.s30 >= stock) out.set(p.id, { k: 'sellingOut' });
    else if (top.has(p.id)) out.set(p.id, { k: 'best' });
    else if (catRank.has(p.id)) out.set(p.id, { k: 'rank', n: catRank.get(p.id) ?? 1, cat: p.cat, catBn: p.catBn });
    else if (p.s30 >= 10) out.set(p.id, { k: 'sold', n: p.s30 >= 100 ? 100 : p.s30 >= 50 ? 50 : p.s30 >= 20 ? 20 : 10 });
  }
  return out;
}

export function productName(p: Product, lang: Lang): string {
  return lang === 'bn' && p.bn ? p.bn : p.n;
}

export function categoryName(c: Category, lang: Lang): string {
  return lang === 'bn' && c.b ? c.b : c.n;
}

export function totalStock(p: Product): number {
  return p.vr ? p.vr.list.reduce((a, v) => a + Math.max(0, v.stock), 0) : p.st;
}

/** Variant prices differ, so cards say "From". */
export function hasPriceRange(p: Product): boolean {
  if (!p.vr) return false;
  const prices = p.vr.list.map((v) => v.price);
  return Math.min(...prices) !== Math.max(...prices);
}

/** Most a customer may put in one order: stock (max 99) and the seller's per-order limit; never below 1. */
export function qtyLimit(p: Product, v: Variant | null): number {
  const stock = v ? v.stock : p.st;
  let m = Math.min(99, Math.max(0, stock));
  if (p.maxQ > 0) m = Math.min(m, p.maxQ);
  return Math.max(1, m);
}

export function inStock(p: Product, v: Variant | null): boolean {
  return (v ? v.stock : totalStock(p)) > 0;
}

export type ShopState = { open: true } | { open: false; food: boolean; next: { inDays: number; weekday: number; minute: number } | null };

export function shopState(s: Store | undefined, ms = Date.now()): ShopState {
  if (!s || isOpen(s.hours, ms)) return { open: true };
  return { open: false, food: s.food, next: nextOpen(s.hours, ms) };
}

/** Product search like the website: English and Bangla titles, tags and the product ID. */
export function searchProducts(all: Product[], q: string): Product[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return all.filter((p) => {
    const hay = `${p.n} ${p.bn} ${p.tags} ${p.pcode} ${p.cat} ${p.catBn}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function searchStores(stores: Store[], q: string): Store[] {
  const s = q.trim().toLowerCase();
  if (!s) return stores;
  return stores.filter((x) => `${x.n} ${x.cat}`.toLowerCase().includes(s));
}

/** Products in a category or any of its sub-categories. */
export function inCategory(all: Product[], cid: number): Product[] {
  return all.filter((p) => p.cid === cid || p.cpath.includes(cid));
}
