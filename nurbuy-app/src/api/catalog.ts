import { isNum, isObj, isStr, num, str, type Obj } from '@/lib/guards';

import { api } from './api';

export type Variant = {
  id: string;
  name: string;
  /** attribute name -> chosen option, e.g. { Weight: '2 kg' } */
  o: Record<string, string>;
  price: number;
  old: number;
  stock: number;
  img: string;
};

export type Variants = {
  attrs: { n: string; t: 'chip' | 'color' }[];
  hex: Record<string, string>;
  list: Variant[];
};

export type Coupon = { code: string; type: 'pct' | 'amt'; value: number; min: number; end: string | null };

export type Product = {
  id: string;
  pcode: string;
  n: string;
  bn: string;
  img: string;
  imgs: string[];
  cid: number;
  cpath: number[];
  /** first seen time in ms; 0 = never shown as new */
  ts: number;
  cat: string;
  catBn: string;
  sub: string;
  pr: number;
  old: number;
  /** stock (999 when the seller does not track stock) */
  st: number;
  /** shop name */
  sh: string;
  /** shop id, e.g. SL1 */
  sid: string;
  about: string;
  aboutBn: string;
  specs: [string, string][];
  tags: string;
  vr: Variants | null;
  cpn: Coupon[];
  /** stock is tracked */
  stockOn: boolean;
  /** per-order quantity limit, 0 = none */
  maxQ: number;
  /** units sold in the last 30 days */
  s30: number;
};

/** Opening hours per weekday (Sunday = 0) as [open, close] minutes in Bangladesh time; null = closed that day. */
export type Hours = ([number, number] | null)[];

export type Store = {
  id: string;
  n: string;
  /** owner name */
  ow: string;
  img: string;
  cover: string;
  about: string;
  hours: Hours | null;
  food: boolean;
  fl: number;
  cat: string;
  since: number;
  /** delivery area ids the shop serves; empty = everywhere */
  cov: number[];
};

export type Category = { id: number; n: string; b: string; slug: string; img: string; subs: Category[] };

export type Settings = {
  name: string;
  walletPct: number;
  codFee: number;
  feeMin: number | null;
  freeAbove: number | null;
  minOrd: number | null;
  maint: boolean;
  cod: boolean;
  bkash: boolean;
  logo: string;
  favicon: string;
  eta: number;
  pol: Record<'about' | 'privacy' | 'return' | 'shipping', { en: string; bn: string } | undefined>;
};

export type AdSlot = { c: number; p: string };

export type Catalog = {
  products: Product[];
  stores: Store[];
  cats: Category[];
  settings: Settings;
  ads: AdSlot[];
  /** Banner Studio and legacy hero data, rendered in a later milestone */
  bs: unknown;
  updated: string;
};

const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter(isStr) : []);
const numArr = (v: unknown): number[] => (Array.isArray(v) ? v.map((x) => num(x, NaN)).filter((x) => !Number.isNaN(x)) : []);
const strMap = (v: unknown): Record<string, string> => {
  const o: Record<string, string> = {};
  if (isObj(v)) for (const [k, x] of Object.entries(v)) if (isStr(x) || isNum(x)) o[k] = String(x);
  return o;
};

function toVariants(v: unknown): Variants | null {
  if (!isObj(v) || !Array.isArray(v.v)) return null;
  const list: Variant[] = v.v.filter(isObj).map((x) => ({
    id: str(x.id),
    name: str(x.name),
    o: strMap(x.o),
    price: num(x.price),
    old: num(x.old),
    stock: num(x.stock),
    img: str(x.img),
  }));
  if (!list.length) return null;
  const attrs = Array.isArray(v.a)
    ? v.a.filter(isObj).map((a) => ({ n: str(a.n), t: a.t === 'color' ? ('color' as const) : ('chip' as const) })).filter((a) => a.n)
    : [];
  return { attrs, hex: strMap(v.hex), list };
}

function toCoupons(v: unknown): Coupon[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isObj).map((c) => ({
    code: str(c.c),
    type: c.t === 'pct' ? 'pct' : 'amt',
    value: num(c.v),
    min: num(c.min),
    end: isStr(c.end) ? c.end : null,
  }));
}

function toSpecs(v: unknown): [string, string][] {
  if (!Array.isArray(v)) return [];
  const out: [string, string][] = [];
  for (const r of v) if (Array.isArray(r) && r.length >= 2) out.push([str(r[0]), str(r[1])]);
  return out;
}

function toProduct(x: Obj): Product | null {
  const id = str(x.id);
  if (!id) return null;
  return {
    id,
    pcode: str(x.pcode),
    n: str(x.n),
    bn: str(x.bn),
    img: str(x.img),
    imgs: strArr(x.imgs),
    cid: num(x.cid),
    cpath: numArr(x.cpath),
    ts: num(x.ts),
    cat: str(x.cat),
    catBn: str(x.catBn),
    sub: str(x.sub),
    pr: num(x.pr),
    old: num(x.old),
    st: Math.max(0, num(x.st)),
    sh: str(x.sh),
    sid: str(x.sid),
    about: str(x.about),
    aboutBn: str(x.aboutBn),
    specs: toSpecs(x.specs),
    tags: str(x.tags),
    vr: toVariants(x.vr),
    cpn: toCoupons(x.cpn),
    stockOn: x.so === undefined ? true : num(x.so) === 1,
    maxQ: num(x.mx),
    s30: num(x.s30),
  };
}

function toHours(v: unknown): Hours | null {
  if (!isObj(v) || !Array.isArray(v.d) || v.d.length !== 7) return null;
  return v.d.map((d) => (Array.isArray(d) && d.length === 2 && isNum(d[0]) && isNum(d[1]) ? [d[0], d[1]] : null));
}

function toStore(x: Obj): Store | null {
  const n = str(x.n);
  if (!n) return null;
  return {
    id: str(x.id),
    n,
    ow: str(x.ow),
    img: str(x.img),
    cover: str(x.cover),
    about: str(x.about),
    hours: toHours(x.hours),
    food: num(x.food) === 1,
    fl: num(x.fl),
    cat: str(x.cat),
    since: num(x.since),
    cov: numArr(x.cov),
  };
}

export function toCategory(x: Obj): Category {
  return {
    id: num(x.id),
    n: str(x.n),
    b: str(x.b),
    slug: str(x.slug),
    img: str(x.img),
    subs: Array.isArray(x.subs) ? x.subs.filter(isObj).map(toCategory) : [],
  };
}

function toPolicy(v: unknown): { en: string; bn: string } | undefined {
  return isObj(v) ? { en: str(v.en), bn: str(v.bn) } : undefined;
}

function toSettings(v: unknown): Settings {
  const s = isObj(v) ? v : {};
  const pol = isObj(s.pol) ? s.pol : {};
  const orNull = (x: unknown) => (x === null || x === undefined ? null : num(x, NaN));
  const nn = (x: number | null) => (x === null || Number.isNaN(x) ? null : x);
  return {
    name: str(s.name, 'NurBuy'),
    walletPct: num(s.walletPct, 1),
    codFee: num(s.codFee, 10),
    feeMin: nn(orNull(s.feeMin)),
    freeAbove: nn(orNull(s.freeAbove)),
    minOrd: nn(orNull(s.minOrd)),
    maint: s.maint === true,
    cod: s.cod !== false,
    bkash: s.bkash !== false,
    logo: str(s.logo),
    favicon: str(s.favicon),
    eta: num(s.eta, 59) || 59,
    pol: { about: toPolicy(pol.about), privacy: toPolicy(pol.privacy), return: toPolicy(pol.return), shipping: toPolicy(pol.shipping) },
  };
}

/** Validates the /catalog document. Returns null when it is not a catalog at all. */
export function toCatalog(v: unknown): Catalog | null {
  if (!isObj(v) || !Array.isArray(v.products)) return null;
  const products: Product[] = [];
  for (const x of v.products) if (isObj(x)) { const p = toProduct(x); if (p) products.push(p); }
  const stores: Store[] = [];
  if (Array.isArray(v.stores)) for (const x of v.stores) if (isObj(x)) { const s = toStore(x); if (s) stores.push(s); }
  return {
    products,
    stores,
    cats: Array.isArray(v.cats) ? v.cats.filter(isObj).map(toCategory) : [],
    settings: toSettings(v.settings),
    ads: Array.isArray(v.ads) ? v.ads.filter(isObj).map((a) => ({ c: num(a.c), p: str(a.p) })).filter((a) => a.p) : [],
    bs: v.bs ?? null,
    updated: str(v.updated),
  };
}

/** Loads the catalog. With `known` (the signature already shown) an unchanged catalog is not converted again (doc null). */
export async function fetchCatalog(known?: string): Promise<{ doc: Catalog | null; raw: unknown }> {
  const raw = await api('GET', '/catalog', { timeoutMs: 30000 });
  if (known && isObj(raw) && typeof raw.updated === 'string' && raw.updated === known) return { doc: null, raw };
  const doc = toCatalog(raw);
  if (!doc) throw new Error('Unexpected catalog');
  return { doc, raw };
}

/** product id -> [average stars, number of reviews], only for reviewed products */
export type ReviewSummary = Record<string, [number, number]>;

export async function fetchReviewSummary(): Promise<ReviewSummary> {
  const r = await api('GET', '/reviews/summary');
  const out: ReviewSummary = {};
  if (isObj(r) && isObj(r.r)) {
    for (const [k, x] of Object.entries(r.r)) if (Array.isArray(x) && x.length >= 2) out[k] = [num(x[0]), num(x[1])];
  }
  return out;
}
