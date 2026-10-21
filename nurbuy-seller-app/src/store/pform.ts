import { create } from 'zustand';

import type { AttrDef, Category, Meta, Product, ProductCore } from '@/api/products';

/** A product photo: uploaded (name + url) or still uploading (tmp, p = progress). */
export type Photo = { key: string; name: string; url: string; tmp?: boolean; p?: number };

/** One variant row while editing; numbers stay as typed text until the form is checked. */
export type VarRow = {
  id: string;
  name: string;
  o: Record<string, string>;
  sku: string;
  price: string;
  old: string;
  stock: string;
  low: string;
  img: string;
  bar: string;
  wt: string;
  on: boolean;
};

export type Attr = { n: string; t: 'color' | 'chip'; opts: string[] };

export type FormV = { pcode: string; name: string; bn: string; cat: string; price: string; old: string; stock: string; about: string; about_bn: string; max_q: string; tags: string };

export type Spec = { key: string; k: string; v: string };

export const MAXVAR = 100;
export const MAXATTR = 3;

/** Colour swatches offered for every colour option (website SWP). */
export const SWATCHES = ['#111111', '#ffffff', '#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00', '#8e24aa', '#6d4c41', '#9e9e9e', '#1a237e', '#ec407a'];

const FALLBACK_ATTRS: AttrDef[] = [
  { id: 'size', n: 'Size', bn: 'সাইজ', t: 'chip', opts: [{ n: 'S', bn: 'S' }, { n: 'M', bn: 'M' }, { n: 'L', bn: 'L' }, { n: 'XL', bn: 'XL' }], cats: [] },
  {
    id: 'color',
    n: 'Color',
    bn: 'রঙ',
    t: 'color',
    opts: [
      { n: 'Black', bn: 'কালো', hex: '#222222' },
      { n: 'White', bn: 'সাদা', hex: '#ffffff' },
      { n: 'Red', bn: 'লাল', hex: '#e53935' },
      { n: 'Blue', bn: 'নীল', hex: '#1e88e5' },
    ],
    cats: [],
  },
];

let keySeq = 0;
export const newKey = () => `k${Date.now().toString(36)}${(keySeq++).toString(36)}`;

type State = {
  ready: boolean;
  id: number | null;
  p: Product | null;
  meta: Meta | null;
  v: FormV;
  /** chosen deeper category levels (ids), below the main category */
  cp: number[];
  /** track stock */
  so: boolean;
  type: 'simple' | 'var';
  imgs: Photo[];
  specs: Spec[];
  attrs: Attr[];
  vars: VarRow[];
  hex: Record<string, string>;
  vmax: number;
  sel: Record<string, true>;
  /** options changed after the last "Generate variants" */
  dirty: boolean;
  /** field -> message */
  errs: Record<string, string>;
  /** variant id -> fields marked wrong */
  vbad: Record<string, string[]>;

  init: (p: Product | null, pcode: string, meta: Meta) => void;
  reset: () => void;
  setV: (k: keyof FormV, val: string) => void;
  setCat: (name: string) => void;
  setLevel: (level: number, id: number | null) => void;
  set: (s: Partial<State>) => void;
};

const EMPTY_V: FormV = { pcode: '', name: '', bn: '', cat: '', price: '', old: '', stock: '', about: '', about_bn: '', max_q: '', tags: '' };

/** The add / edit product form (website PF), shared by the form's parts. */
export const usePForm = create<State>((set, get) => ({
  ready: false,
  id: null,
  p: null,
  meta: null,
  v: EMPTY_V,
  cp: [],
  so: true,
  type: 'simple',
  imgs: [],
  specs: [],
  attrs: [],
  vars: [],
  hex: {},
  vmax: 0,
  sel: {},
  dirty: false,
  errs: {},
  vbad: {},

  init: (p, pcode, meta) => {
    const base: Partial<ProductCore> & Partial<Product> = p ? { ...p, ...(p.chg ?? {}) } : {};
    const v: FormV = p
      ? {
          pcode: p.pcode,
          name: base.name ?? '',
          bn: base.bn ?? '',
          cat: base.cat ?? '',
          price: base.price ? String(base.price) : '',
          old: base.old && base.old > 0 ? String(base.old) : '',
          stock: p.stock_on ? String(p.stock) : '',
          about: base.about ?? '',
          about_bn: base.about_bn ?? '',
          max_q: p.max_q > 0 ? String(p.max_q) : '',
          tags: p.tags.join(', '),
        }
      : { ...EMPTY_V, pcode };
    // the saved category id gives the main category and the deeper levels
    let cp: number[] = [];
    const path = base.cat_id ? catPath(meta.cats, base.cat_id) : null;
    if (path?.[0]) {
      v.cat = path[0].n;
      cp = path.slice(1).map((c) => c.id);
    } else if (base.sub) {
      const root = meta.cats.find((c) => c.n === base.cat);
      const sub = root?.subs.find((c) => c.n === base.sub);
      if (sub) cp = [sub.id];
    }
    const names = base.imgs ?? [];
    const urls = base.img_urls ?? [];
    const imgs: Photo[] = names.map((name, i) => ({ key: newKey(), name, url: urls[i] ?? '' }));
    const vr = base.vr ?? null;
    const attrs: Attr[] = [];
    let vars: VarRow[] = [];
    let vmax = 0;
    if (vr && vr.v.length) {
      for (const a of vr.a) {
        const opts: string[] = [];
        for (const x of vr.v) {
          const o = x.o[a.n];
          if (o !== undefined && !opts.includes(o)) opts.push(o);
        }
        attrs.push({ n: a.n, t: a.t, opts });
      }
      vars = vr.v.map((x) => ({
        id: x.id,
        name: x.name,
        o: { ...x.o },
        sku: x.sku,
        price: String(x.price),
        old: x.old > 0 ? String(x.old) : '',
        stock: String(x.stock),
        low: String(x.low),
        img: x.img,
        bar: x.bar,
        wt: x.wt,
        on: x.on,
      }));
      for (const x of vars) {
        const m = /^v(\d+)$/.exec(x.id);
        if (m) vmax = Math.max(vmax, Number(m[1]));
      }
    }
    set({
      ready: true,
      id: p ? p.id : null,
      p,
      meta,
      v,
      cp,
      so: p ? p.stock_on : true,
      type: vars.length ? 'var' : 'simple',
      imgs,
      specs: (base.specs ?? []).map(([k, val]) => ({ key: newKey(), k, v: val })),
      attrs,
      vars,
      hex: { ...(vr?.hex ?? {}) },
      vmax,
      sel: {},
      dirty: false,
      errs: {},
      vbad: {},
    });
  },

  reset: () => set({ ready: false, id: null, p: null, v: EMPTY_V, cp: [], imgs: [], specs: [], attrs: [], vars: [], hex: {}, sel: {}, errs: {}, vbad: {}, dirty: false }),

  setV: (k, val) => {
    const errs = get().errs;
    set({ v: { ...get().v, [k]: val }, errs: errs[k] ? { ...errs, [k]: '' } : errs });
  },

  setCat: (name) => {
    const errs = get().errs;
    set({ v: { ...get().v, cat: name }, cp: [], errs: errs.cat ? { ...errs, cat: '' } : errs });
  },

  setLevel: (level, id) => {
    const cp = get().cp.slice(0, level);
    if (id) cp.push(id);
    set({ cp });
  },

  set: (s) => set(s),
}));

/** Path of categories from the main one down to the given id, or null. */
export function catPath(cats: Category[], id: number): Category[] | null {
  for (const c of cats) {
    if (c.id === id) return [c];
    const sub = catPath(c.subs, id);
    if (sub) return [c, ...sub];
  }
  return null;
}

export const catName = (c: Category, lang: 'en' | 'bn') => (lang === 'bn' && c.b ? c.b : c.n);

/** The attribute catalogue from the server, or the website's small fallback. */
export function attrCatalog(meta: Meta | null): AttrDef[] {
  return meta && meta.attrs.length ? meta.attrs : FALLBACK_ATTRS;
}

export function attrDef(meta: Meta | null, name: string): AttrDef | undefined {
  const k = name.toLowerCase();
  return attrCatalog(meta).find((a) => a.n.toLowerCase() === k);
}

/** Attribute and option labels in the current language. */
export function attrLabel(meta: Meta | null, name: string, lang: 'en' | 'bn'): string {
  const d = attrDef(meta, name);
  return lang === 'bn' && d?.bn ? d.bn : name;
}

export function optLabel(meta: Meta | null, attr: string, val: string, lang: 'en' | 'bn'): string {
  if (lang !== 'bn') return val;
  const o = attrDef(meta, attr)?.opts.find((x) => x.n === val);
  return o?.bn || val;
}

export const vkey = (o: Record<string, string>, attrs: Attr[]) => attrs.map((a) => `${a.n}=${o[a.n] ?? ''}`).join('|');
export const vlabel = (o: Record<string, string>, attrs: Attr[]) => attrs.map((a) => o[a.n] ?? '').join(' / ');

/** Every combination of the chosen options. */
export function combos(attrs: Attr[]): Record<string, string>[] {
  let out: Record<string, string>[] = [{}];
  for (const a of attrs) {
    const nx: Record<string, string>[] = [];
    for (const c of out) for (const o of a.opts) nx.push({ ...c, [a.n]: o });
    out = nx;
  }
  return out;
}
