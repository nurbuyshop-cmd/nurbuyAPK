import { isObj, isStr, num, numOrNull, str, strOrNull, type Obj } from '@/lib/guards';

import { api } from './api';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type DocKind = 'nid_front' | 'nid_back' | 'license';
export const DOC_KINDS: DocKind[] = ['nid_front', 'nid_back', 'license'];

export type Seller = {
  id: number;
  shop_name: string;
  owner_name: string;
  mobile: string;
  email: string;
  address: string;
  nid: string;
  trade_no: string;
  category: string;
  about: string;
  logo: string | null;
  cover: string | null;
  /** owner photo riders see */
  photo: string | null;
  status: SellerStatus;
  reject_reason: string;
  docs: Record<DocKind, boolean>;
  /** mobile / email changes waiting for admin approval */
  chg: Record<string, string> | null;
  /** opening hours (null = always open) */
  hours: unknown;
  open_now: boolean;
  lat: number | null;
  lng: number | null;
};

const STATUSES: SellerStatus[] = ['pending', 'approved', 'rejected', 'suspended'];

export function toSeller(v: unknown): Seller {
  const o = isObj(v) ? v : {};
  const docs = isObj(o.docs) ? o.docs : {};
  const st = str(o.status);
  const chg = isObj(o.chg) ? Object.fromEntries(Object.entries(o.chg).map(([k, x]) => [k, str(x)])) : null;
  return {
    id: num(o.id),
    shop_name: str(o.shop_name),
    owner_name: str(o.owner_name),
    mobile: str(o.mobile),
    email: str(o.email),
    address: str(o.address),
    nid: str(o.nid),
    trade_no: str(o.trade_no),
    category: str(o.category),
    about: str(o.about),
    logo: strOrNull(o.logo),
    cover: strOrNull(o.cover),
    photo: strOrNull(o.photo),
    status: (STATUSES as string[]).includes(st) ? (st as SellerStatus) : 'pending',
    reject_reason: str(o.reject_reason),
    docs: { nid_front: !!docs.nid_front, nid_back: !!docs.nid_back, license: !!docs.license },
    chg: chg && Object.keys(chg).length ? chg : null,
    hours: o.hours ?? null,
    open_now: !!o.open_now,
    lat: numOrNull(o.lat),
    lng: numOrNull(o.lng),
  };
}

export const isSeller = (v: unknown): v is Seller => isObj(v) && typeof v.id === 'number' && typeof v.shop_name === 'string' && isObj(v.docs);

const sellerOf = (d: unknown): Seller => toSeller(isObj(d) ? d.seller : null);

/* ---------- auth ---------- */

export async function login(id: string, password: string): Promise<{ token: string; seller: Seller }> {
  const d = await api('POST', '/seller/login', { body: { id, password }, anon: true });
  const o = isObj(d) ? d : {};
  return { token: str(o.token), seller: sellerOf(o) };
}

export type SignupBody = {
  shop_name: string;
  category: string;
  about: string;
  owner_name: string;
  mobile: string;
  email: string;
  address: string;
  nid: string;
  trade_no: string;
  password: string;
};

export async function signup(b: SignupBody): Promise<{ token: string; seller: Seller }> {
  const d = await api('POST', '/seller/signup', { body: { ...b, sell_view: 'min' }, anon: true });
  const o = isObj(d) ? d : {};
  return { token: str(o.token), seller: sellerOf(o) };
}

export async function logout(): Promise<void> {
  await api('POST', '/seller/logout');
}

export async function me(): Promise<Seller> {
  return sellerOf(await api('GET', '/seller/me'));
}

export async function updateMe(body: Obj): Promise<Seller> {
  return sellerOf(await api('PUT', '/seller/me', { body }));
}

export async function reapply(): Promise<Seller> {
  return sellerOf(await api('POST', '/seller/reapply'));
}

export async function changePassword(current: string, password: string): Promise<void> {
  await api('POST', '/seller/password', { body: { current, password } });
}

export async function removeCover(): Promise<Seller> {
  return sellerOf(await api('DELETE', '/seller/cover'));
}

/* ---------- uploads ---------- */

export type UploadKind = DocKind | 'logo' | 'cover' | 'photo' | 'product';
export type LocalFile = { uri: string; name: string; type: string };

/** Sends one file to /seller/upload. Documents, logo, cover and photo answer with the updated seller. */
export async function upload(kind: UploadKind, file: LocalFile, onProgress?: (p: number) => void): Promise<Obj> {
  const form = new FormData();
  form.append('kind', kind);
  // React Native's FormData file part
  form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  const d = await api('POST', '/seller/upload', { form, onProgress });
  return isObj(d) ? d : {};
}

export async function uploadForSeller(kind: UploadKind, file: LocalFile, onProgress?: (p: number) => void): Promise<Seller> {
  return sellerOf(await upload(kind, file, onProgress));
}

/* ---------- dashboard ---------- */

export type OrderState = 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';

export type OrderItem = { n: string; bn: string; q: number; unit: number; variant: string };

export type SellerOrder = {
  id: string;
  view: string;
  st: OrderState;
  note: string;
  items: OrderItem[];
  sub: number;
  other: boolean;
  cu: string;
  pay: string;
  created_at: number;
  updated_at: number;
};

const ORDER_STATES: OrderState[] = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'rejected'];

export function toOrder(v: unknown): SellerOrder {
  const o = isObj(v) ? v : {};
  const st = str(o.st);
  const items = Array.isArray(o.items) ? o.items : [];
  return {
    id: str(o.id),
    view: str(o.view),
    st: (ORDER_STATES as string[]).includes(st) ? (st as OrderState) : 'new',
    note: str(o.note),
    items: items.filter(isObj).map((i) => ({ n: str(i.n), bn: str(i.bn), q: num(i.q, 1), unit: num(i.unit), variant: str(i.variant) })),
    sub: num(o.sub),
    other: !!o.other,
    cu: str(o.cu),
    pay: str(o.pay),
    created_at: num(o.created_at),
    updated_at: num(o.updated_at),
  };
}

export type Dashboard = {
  stats: { new: number; confirmed: number; packed: number; today: number; delivered: number; sales_today: number; sales_total: number; cancelled: number };
  products: { active: number; pending: number; rejected: number; low: number; out: number };
  recent: SellerOrder[];
  unread: number;
  wallet: { available: number; pending: number } | null;
};

export async function dashboard(): Promise<Dashboard> {
  const d = await api('GET', '/seller/dashboard');
  const o = isObj(d) ? d : {};
  const s = isObj(o.stats) ? o.stats : {};
  const p = isObj(o.products) ? o.products : {};
  const w = isObj(o.wallet) ? o.wallet : null;
  return {
    stats: {
      new: num(s.new),
      confirmed: num(s.confirmed),
      packed: num(s.packed),
      today: num(s.today),
      delivered: num(s.delivered),
      sales_today: num(s.sales_today),
      sales_total: num(s.sales_total),
      cancelled: num(s.cancelled),
    },
    products: { active: num(p.active), pending: num(p.pending), rejected: num(p.rejected), low: num(p.low), out: num(p.out) },
    recent: Array.isArray(o.recent) ? o.recent.map(toOrder) : [],
    unread: num(o.unread),
    wallet: w ? { available: num(w.available), pending: num(w.pending) } : null,
  };
}

/* ---------- orders ---------- */

export type OrderCounts = Record<OrderState | 'all', number>;

export async function orders(): Promise<{ orders: SellerOrder[]; counts: OrderCounts }> {
  const d = await api('GET', '/seller/orders');
  const o = isObj(d) ? d : {};
  const c = isObj(o.counts) ? o.counts : {};
  const counts = Object.fromEntries([...ORDER_STATES, 'all'].map((k) => [k, num(c[k])])) as OrderCounts;
  return { orders: Array.isArray(o.orders) ? o.orders.map(toOrder) : [], counts };
}

export async function order(id: string): Promise<SellerOrder> {
  const d = await api('GET', `/seller/orders/${encodeURIComponent(id)}`);
  return toOrder(isObj(d) ? d.order : null);
}

export async function orderAction(id: string, action: 'confirm' | 'pack' | 'reject', reason?: string): Promise<void> {
  await api('POST', `/seller/orders/${encodeURIComponent(id)}/action`, { body: reason ? { action, reason } : { action } });
}

/* ---------- notifications ---------- */

export type SellerNotif = { id: number; title: string; body: string; read: boolean; at: number; url: string; kind: string };

export async function notifications(): Promise<{ list: SellerNotif[]; unread: number }> {
  const d = await api('GET', '/seller/notifications');
  const o = isObj(d) ? d : {};
  const list = Array.isArray(o.notifications) ? o.notifications.filter(isObj) : [];
  return {
    list: list.map((n) => ({
      id: num(n.id),
      title: str(n.title),
      body: str(n.body),
      read: !!num(n.read),
      at: num(n.at),
      url: isStr(n.url) ? n.url : '',
      kind: str(n.kind),
    })),
    unread: num(o.unread),
  };
}

export async function markNotificationsRead(): Promise<void> {
  await api('POST', '/seller/notifications/read');
}
