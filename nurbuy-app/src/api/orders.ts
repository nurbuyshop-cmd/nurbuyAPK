import { isObj, num, str, strOrNull, type Obj } from '@/lib/guards';

import { api } from './api';

export type OrderItem = { id: string; n: string; bn: string; unit: number; q: number; shop: string; vid: string; variant: string; disc: number };

export type OrderEta = { start: number; mins: number; extra: number; due: number; now: number; done: number | null };

export type Delivery = { rstat: string; otp: string | null; rider: string };

export type Order = {
  id: string;
  status: string;
  sub: number;
  fee: number;
  cod: number;
  total: number;
  disc: number;
  coupon: string | null;
  pay: string;
  shop: string;
  name: string;
  mobile: string;
  address: string;
  items: OrderItem[];
  extra: Obj;
  cashback: number;
  paid: number;
  createdAt: number;
  updatedAt: number;
  eta: OrderEta | null;
  bonus: { amount: number; state: string } | null;
  delivery: Delivery | null;
};

function toItem(x: Obj): OrderItem {
  return {
    id: str(x.id),
    n: str(x.n),
    bn: str(x.bn),
    unit: num(x.unit),
    q: num(x.q),
    shop: str(x.shop),
    vid: str(x.vid),
    variant: str(x.variant),
    disc: num(x.disc),
  };
}

export function toOrder(v: unknown): Order | null {
  if (!isObj(v) || typeof v.id !== 'string') return null;
  const e = isObj(v.eta) ? v.eta : null;
  const b = isObj(v.bonus) ? v.bonus : null;
  const d = isObj(v.delivery) ? v.delivery : null;
  return {
    id: v.id,
    status: str(v.status),
    sub: num(v.sub),
    fee: num(v.fee),
    cod: num(v.cod),
    total: num(v.total),
    disc: num(v.disc),
    coupon: strOrNull(v.coupon),
    pay: str(v.pay),
    shop: str(v.shop),
    name: str(v.name),
    mobile: str(v.mobile),
    address: str(v.address),
    items: Array.isArray(v.items) ? v.items.filter(isObj).map(toItem) : [],
    extra: isObj(v.extra) ? v.extra : {},
    cashback: num(v.cashback),
    paid: num(v.paid),
    createdAt: num(v.created_at),
    updatedAt: num(v.updated_at),
    eta: e ? { start: num(e.start), mins: num(e.mins), extra: num(e.extra), due: num(e.due), now: num(e.now), done: e.done == null ? null : num(e.done) } : null,
    bonus: b ? { amount: num(b.amount), state: str(b.state) } : null,
    delivery: d ? { rstat: str(d.rstat), otp: strOrNull(d.otp), rider: str(d.rider) } : null,
  };
}

export type OrderRequest = {
  view: 'min';
  items: { id: string; n: string; bn: string; e: string; unit: number; q: number; shop: string; vid?: string; variant?: string }[];
  fee: number;
  loc_id: number | null;
  pay: 'cod' | 'wallet' | 'online';
  name: string;
  mobile: string;
  email: string;
  address: string;
  shop: string;
  coupon?: string;
  extra: { loc: string; cart: 1; geo?: Obj };
};

export async function placeOrder(body: OrderRequest): Promise<{ order: Order; walletBal: number; cashback: number }> {
  const r = await api('POST', '/orders', { body, timeoutMs: 30000 });
  const order = isObj(r) ? toOrder(r.order) : null;
  if (!isObj(r) || !order) throw new Error('Unexpected server answer');
  return { order, walletBal: isObj(r.wallet) ? num(r.wallet.bal) : 0, cashback: num(r.cashback) };
}

export async function myOrders(): Promise<Order[]> {
  const r = await api('GET', '/orders/mine');
  return isObj(r) && Array.isArray(r.orders) ? r.orders.map(toOrder).filter((o): o is Order => !!o) : [];
}

export type LiveShare = { lat: number; lng: number; at: number; fresh: boolean } | null;

const toLive = (v: unknown): LiveShare => (isObj(v) && isObj(v.live) ? { lat: num(v.live.lat), lng: num(v.live.lng), at: num(v.live.at), fresh: v.live.fresh === true } : null);

export async function getLive(id: string): Promise<LiveShare> {
  return toLive(await api('GET', `/orders/${encodeURIComponent(id)}/live`));
}

export async function sendLive(id: string, p: { lat: number; lng: number; acc: number } | { off: true }): Promise<LiveShare> {
  return toLive(await api('POST', `/orders/${encodeURIComponent(id)}/live`, { body: p }));
}

export type CouponResult = { code: string; discount: number };

export async function checkCoupon(code: string, items: { id: string; unit: number; q: number; shop: string }[]): Promise<CouponResult> {
  const r = await api('POST', '/coupons/check', { body: { code, items } });
  return { code: isObj(r) ? str(r.code, code) : code, discount: isObj(r) ? num(r.discount) : 0 };
}
