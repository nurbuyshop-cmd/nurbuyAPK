import type { Product } from '@/api/catalog';

import type { CatalogIndex } from './products';
import { totalStock } from './products';

/**
 * Suggestions, with the same scoring as the website: a base score from the discount and recent sales, plus matches with the
 * last two products the customer opened (same category +6/+4, same sub-category +2, shared tags up to +3).
 */
export type Seen = { cat: string; sub: string; tags: string };

const tagsOf = (s: string) => s.toLowerCase().split(/[,\s]+/).filter((x) => x.length > 1);

function tagHit(a: string, b: string): number {
  const t = tagsOf(a);
  return tagsOf(b).filter((x) => t.includes(x)).length;
}

export const seenOf = (p: Product): Seen => ({ cat: p.cat, sub: p.sub, tags: p.tags });

function base(p: Product): number {
  const d = p.old > p.pr ? (p.old - p.pr) / p.old : 0;
  return Math.min(d, 0.6) * 5 + Math.log(1 + p.s30) * 0.8;
}

function score(p: Product, recent: Seen[]): number {
  let s = base(p);
  recent.forEach((r, i) => {
    if (p.cat && p.cat === r.cat) s += i ? 4 : 6;
    if (p.sub && r.sub && p.sub === r.sub) s += 2;
    s += Math.min(3, tagHit(r.tags, p.tags));
  });
  return s;
}

const inStock = (p: Product) => !p.stockOn || totalStock(p) > 0;

/** Stable sort by score, highest first; out-of-stock products go last. */
function rank(list: Product[], recent: Seen[]): Product[] {
  const ix = list.map((p, i) => ({ p, i, s: (inStock(p) ? 0 : -1000) + score(p, recent) }));
  ix.sort((a, b) => b.s - a.s || a.i - b.i);
  return ix.map((x) => x.p);
}

/** Hot Deals / Best Selling order: with recent views by relevance, without them Best Selling by sales. */
export function personalised(list: Product[], recent: Seen[]): Product[] {
  if (recent.length) return rank(list, recent);
  return [...list].sort((a, b) => (inStock(b) ? 0 : -1000) + Math.log(1 + b.s30) - ((inStock(a) ? 0 : -1000) + Math.log(1 + a.s30)));
}

/** "Recommended for You" (or "Popular right now" without history): up to 10 in-stock products not just viewed. */
export function recommended(idx: CatalogIndex, recent: Product[]): Product[] {
  const ids = new Set(recent.map((p) => p.id));
  const seen = recent.slice(0, 2).map(seenOf);
  return rank(idx.all.filter((p) => inStock(p) && !ids.has(p.id)), seen).slice(0, 10);
}

/** "Related Products" on a product page: same category, sub-category or tags, best first (max 8). */
export function related(idx: CatalogIndex, p: Product, recent: Product[]): Product[] {
  const seen = recent.filter((x) => x.id !== p.id).slice(0, 2).map(seenOf);
  const c = idx.all.filter((q) => q.id !== p.id && inStock(q) && (q.cat === p.cat || (p.sub && q.sub === p.sub) || tagHit(p.tags, q.tags) > 0));
  const rel = (q: Product) => (q.cat === p.cat ? 6 : 0) + (p.sub && q.sub === p.sub ? 3 : 0) + tagHit(p.tags, q.tags) * 1.5 + base(q) + (seen.length ? score(q, seen) * 0.3 : 0);
  return c
    .map((q, i) => ({ q, i, s: rel(q) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 8)
    .map((x) => x.q);
}
