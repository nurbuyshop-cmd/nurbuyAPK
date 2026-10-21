import { isObj, isStr, num, str, strOrNull, type Obj } from '@/lib/guards';

import { api } from './api';
import { upload, type LocalFile } from './seller';

export type ProductStatus = 'pending' | 'active' | 'rejected';

export type VariantAttr = { n: string; t: 'color' | 'chip' };

export type Variant = {
  id: string;
  name: string;
  o: Record<string, string>;
  sku: string;
  price: number;
  old: number;
  stock: number;
  low: number;
  /** full photo URL ('' = none) */
  img: string;
  bar: string;
  wt: string;
  on: boolean;
};

export type Variants = { a: VariantAttr[]; hex: Record<string, string>; v: Variant[] };

/** The fields a seller edits (also the shape of a pending edit, "chg"). */
export type ProductCore = {
  name: string;
  bn: string;
  price: number;
  old: number;
  cat: string;
  sub: string;
  cat_id: number | null;
  about: string;
  about_bn: string;
  specs: [string, string][];
  imgs: string[];
  img_urls: string[];
  vr: Variants | null;
};

export type Product = ProductCore & {
  id: number;
  stock: number;
  cat_path: string[];
  status: ProductStatus;
  hidden: boolean;
  reject_reason: string;
  sold: number;
  stock_on: boolean;
  max_q: number;
  pcode: string;
  tags: string[];
  /** an edit waiting for review (older API versions) */
  chg: Partial<ProductCore> | null;
};

function toStrMap(v: unknown): Record<string, string> {
  return isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, str(x)])) : {};
}

export function toVariants(v: unknown): Variants | null {
  if (!isObj(v) || !Array.isArray(v.v) || !v.v.length) return null;
  const a = Array.isArray(v.a) ? v.a.filter(isObj).map((x) => ({ n: str(x.n), t: x.t === 'color' ? ('color' as const) : ('chip' as const) })) : [];
  return {
    a,
    hex: toStrMap(v.hex),
    v: v.v.filter(isObj).map((x) => ({
      id: str(x.id),
      name: str(x.name),
      o: toStrMap(x.o),
      sku: str(x.sku),
      price: num(x.price),
      old: num(x.old),
      stock: num(x.stock),
      low: num(x.low),
      img: str(x.img),
      bar: str(x.bar),
      wt: str(x.wt),
      on: num(x.on, 1) !== 0,
    })),
  };
}

function toSpecs(v: unknown): [string, string][] {
  return Array.isArray(v) ? v.filter((r): r is unknown[] => Array.isArray(r) && r.length >= 2).map((r) => [str(r[0]), str(r[1])]) : [];
}

const strList = (v: unknown): string[] => (Array.isArray(v) ? v.filter(isStr) : []);

function toCore(o: Obj): Partial<ProductCore> {
  const c: Partial<ProductCore> = {};
  if ('name' in o) c.name = str(o.name);
  if ('bn' in o) c.bn = str(o.bn);
  if ('price' in o) c.price = num(o.price);
  if ('old' in o) c.old = num(o.old);
  if ('cat' in o) c.cat = str(o.cat);
  if ('sub' in o) c.sub = str(o.sub);
  if ('cat_id' in o) c.cat_id = o.cat_id === null ? null : num(o.cat_id) || null;
  if ('about' in o) c.about = str(o.about);
  if ('about_bn' in o) c.about_bn = str(o.about_bn);
  if ('specs' in o) c.specs = toSpecs(o.specs);
  if ('imgs' in o) c.imgs = strList(o.imgs);
  if ('img_urls' in o) c.img_urls = strList(o.img_urls);
  if ('vr' in o) c.vr = toVariants(o.vr);
  return c;
}

export function toProduct(v: unknown): Product {
  const o = isObj(v) ? v : {};
  const st = str(o.status);
  return {
    id: num(o.id),
    name: str(o.name),
    bn: str(o.bn),
    price: num(o.price),
    old: num(o.old),
    stock: num(o.stock),
    cat: str(o.cat),
    sub: str(o.sub),
    cat_id: o.cat_id === null || o.cat_id === undefined ? null : num(o.cat_id) || null,
    cat_path: strList(o.cat_path),
    about: str(o.about),
    about_bn: str(o.about_bn),
    specs: toSpecs(o.specs),
    imgs: strList(o.imgs),
    img_urls: strList(o.img_urls),
    status: st === 'active' || st === 'rejected' ? st : 'pending',
    hidden: !!num(o.hidden),
    reject_reason: str(o.reject_reason),
    sold: num(o.sold),
    vr: toVariants(o.vr),
    stock_on: num(o.stock_on, 1) !== 0,
    max_q: num(o.max_q),
    pcode: str(o.pcode),
    tags: strList(o.tags),
    chg: isObj(o.chg) && Object.keys(o.chg).length ? toCore(o.chg) : null,
  };
}

const productOf = (d: unknown): Product => toProduct(isObj(d) ? d.product : null);

export type ProductCounts = { all: number; active: number; pending: number; rejected: number; hidden: number; low: number; out: number };

export async function products(): Promise<{ products: Product[]; counts: ProductCounts }> {
  const d = await api('GET', '/seller/products');
  const o = isObj(d) ? d : {};
  const c = isObj(o.counts) ? o.counts : {};
  return {
    products: Array.isArray(o.products) ? o.products.map(toProduct) : [],
    counts: { all: num(c.all), active: num(c.active), pending: num(c.pending), rejected: num(c.rejected), hidden: num(c.hidden), low: num(c.low), out: num(c.out) },
  };
}

export async function product(id: number): Promise<Product> {
  return productOf(await api('GET', `/seller/products/${id}`));
}

export async function newProductCode(): Promise<string> {
  try {
    const d = await api('GET', '/seller/pcode-new');
    return isObj(d) ? str(d.code) : '';
  } catch {
    return '';
  }
}

export async function saveProduct(id: number | null, body: Obj): Promise<Product> {
  return productOf(await api(id ? 'PUT' : 'POST', id ? `/seller/products/${id}` : '/seller/products', { body }));
}

export async function setStock(id: number, stock: number): Promise<Product> {
  return productOf(await api('POST', `/seller/products/${id}/stock`, { body: { stock } }));
}

export async function setVariantStock(id: number, v: { id: string; stock: number; on: number }[]): Promise<Product> {
  return productOf(await api('POST', `/seller/products/${id}/variants/stock`, { body: { v } }));
}

export async function setHidden(id: number, hidden: boolean): Promise<Product> {
  return productOf(await api('POST', `/seller/products/${id}/visibility`, { body: { hidden } }));
}

export async function deleteProduct(id: number): Promise<void> {
  await api('DELETE', `/seller/products/${id}`);
}

/** Uploads one product photo; the server answers with its file name (sent back in imgs) and URL. */
export async function uploadProductPhoto(f: LocalFile, onProgress?: (p: number) => void): Promise<{ name: string; url: string }> {
  const d = await upload('product', f, onProgress);
  return { name: str(d.name), url: str(d.url) };
}

/* ---------- categories and attribute catalog ---------- */

export type Category = { id: number; n: string; b: string; subs: Category[] };
export type AttrOption = { n: string; bn: string; hex?: string };
export type AttrDef = { id: string; n: string; bn: string; t: 'color' | 'chip'; opts: AttrOption[]; cats: string[] };
export type Meta = { cats: Category[]; attrs: AttrDef[] };

function toCat(v: unknown): Category | null {
  if (!isObj(v)) return null;
  return { id: num(v.id), n: str(v.n), b: str(v.b) || str(v.n), subs: Array.isArray(v.subs) ? v.subs.map(toCat).filter((x): x is Category => !!x) : [] };
}

export async function meta(): Promise<Meta> {
  const d = await api('GET', '/seller/meta');
  const o = isObj(d) ? d : {};
  const cats = Array.isArray(o.cats) ? o.cats.map(toCat).filter((x): x is Category => !!x) : [];
  const attrs = Array.isArray(o.attrs)
    ? o.attrs.filter(isObj).map((a) => ({
        id: str(a.id),
        n: str(a.n),
        bn: str(a.bn) || str(a.n),
        t: a.t === 'color' ? ('color' as const) : ('chip' as const),
        opts: Array.isArray(a.opts) ? a.opts.filter(isObj).map((x) => ({ n: str(x.n), bn: str(x.bn) || str(x.n), hex: strOrNull(x.hex) ?? undefined })) : [],
        cats: strList(a.cats),
      }))
    : [];
  return { cats, attrs };
}
