import { isObj, num, str, type Obj } from '@/lib/guards';

import { api } from './api';

export type EarnStatus = 'pending' | 'available' | 'cancelled';
export type WdStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type Earning = {
  id: number;
  order_id: string;
  pname: string;
  variant: string;
  qty: number;
  unit: number;
  sale: number;
  disc: number;
  com_pct: number;
  commission: number;
  net: number;
  status: EarnStatus;
  order_at: number;
  cleared_at: number | null;
};

export type BkashDetails = { number: string; acc_type: 'personal' | 'agent' | 'merchant'; acc_name: string };
export type BankDetails = { holder: string; bank: string; branch: string; acc_no: string; routing: string; acc_type: '' | 'savings' | 'current'; note: string };

export type Withdrawal = {
  id: number;
  no: string;
  amount: number;
  method: 'bkash' | 'bank';
  details: Record<string, string>;
  status: WdStatus;
  reason: string;
  admin_note: string;
  pay_ref: string;
  admin_name: string;
  paid_at: number | null;
  created_at: number;
};

export type Tx = { id: number; kind: string; amount: number; effect: number; bal: number; ref: string; note: string; at: number };

export type ByProduct = { pname: string; qty: number; sale: number; disc: number; commission: number; net: number; earned: number };

export type WalletSummary = { total: number; available: number; pending: number; wd_pending: number; withdrawn: number; min: number; com_pct: number };

export type Wallet = {
  summary: WalletSummary;
  earnings: Earning[];
  withdrawals: Withdrawal[];
  tx: Tx[];
  by_product: ByProduct[];
  payout: { last?: 'bkash' | 'bank'; bkash?: Partial<BkashDetails>; bank?: Partial<BankDetails> };
};

const arr = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const strMap = (v: unknown): Record<string, string> => (isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, str(x)])) : {});

export function toWithdrawal(w: Obj): Withdrawal {
  const st = str(w.status);
  return {
    id: num(w.id),
    no: str(w.no),
    amount: num(w.amount),
    method: w.method === 'bank' ? 'bank' : 'bkash',
    details: strMap(w.details),
    status: st === 'processing' || st === 'completed' || st === 'cancelled' ? st : 'pending',
    reason: str(w.reason),
    admin_note: str(w.admin_note),
    pay_ref: str(w.pay_ref),
    admin_name: str(w.admin_name),
    paid_at: w.paid_at == null ? null : num(w.paid_at),
    created_at: num(w.created_at),
  };
}

export async function wallet(): Promise<Wallet> {
  const d = await api('GET', '/seller/wallet');
  const o = isObj(d) ? d : {};
  const s = isObj(o.summary) ? o.summary : {};
  const po = isObj(o.payout) ? o.payout : {};
  return {
    summary: {
      total: num(s.total),
      available: num(s.available),
      pending: num(s.pending),
      wd_pending: num(s.wd_pending),
      withdrawn: num(s.withdrawn),
      min: num(s.min),
      com_pct: num(s.com_pct),
    },
    earnings: arr(o.earnings).map((e) => {
      const st = str(e.status);
      return {
        id: num(e.id),
        order_id: str(e.order_id),
        pname: str(e.pname),
        variant: str(e.variant),
        qty: num(e.qty),
        unit: num(e.unit),
        sale: num(e.sale),
        disc: num(e.disc),
        com_pct: num(e.com_pct),
        commission: num(e.commission),
        net: num(e.net),
        status: st === 'available' || st === 'cancelled' ? st : 'pending',
        order_at: num(e.order_at),
        cleared_at: e.cleared_at == null ? null : num(e.cleared_at),
      };
    }),
    withdrawals: arr(o.withdrawals).map(toWithdrawal),
    tx: arr(o.tx).map((x) => ({ id: num(x.id), kind: str(x.kind), amount: num(x.amount), effect: num(x.effect), bal: num(x.bal), ref: str(x.ref), note: str(x.note), at: num(x.at) })),
    by_product: arr(o.by_product).map((x) => ({ pname: str(x.pname), qty: num(x.qty), sale: num(x.sale), disc: num(x.disc), commission: num(x.commission), net: num(x.net), earned: num(x.earned) })),
    payout: {
      last: po.last === 'bank' || po.last === 'bkash' ? po.last : undefined,
      bkash: isObj(po.bkash) ? (strMap(po.bkash) as Partial<BkashDetails>) : undefined,
      bank: isObj(po.bank) ? (strMap(po.bank) as Partial<BankDetails>) : undefined,
    },
  };
}

export async function requestWithdraw(amount: number, method: 'bkash' | 'bank', details: BkashDetails | BankDetails): Promise<Withdrawal> {
  const d = await api('POST', '/seller/withdrawals', { body: { amount, method, details } });
  return toWithdrawal(isObj(d) && isObj(d.withdrawal) ? d.withdrawal : {});
}

export type WdSeller = { shop_name: string; owner_name: string; mobile: string; address: string };

export async function withdrawal(id: number): Promise<{ w: Withdrawal; seller: WdSeller }> {
  const d = await api('GET', `/seller/withdrawals/${id}`);
  const o = isObj(d) ? d : {};
  const s = isObj(o.seller) ? o.seller : {};
  return {
    w: toWithdrawal(isObj(o.withdrawal) ? o.withdrawal : {}),
    seller: { shop_name: str(s.shop_name), owner_name: str(s.owner_name), mobile: str(s.mobile), address: str(s.address) },
  };
}

/* ---------- coupons ---------- */

export type CouponState = 'live' | 'inactive' | 'scheduled' | 'expired' | 'used_up';

export type Coupon = {
  id: number;
  product_id: number;
  pname: string;
  code: string;
  type: 'pct' | 'fixed';
  value: number;
  min_buy: number;
  /** YYYY-MM-DD or '' */
  starts: string;
  ends: string;
  max_uses: number;
  per_user: number;
  used: number;
  status: 'active' | 'inactive';
  state: CouponState;
};

const STATES: CouponState[] = ['live', 'inactive', 'scheduled', 'expired', 'used_up'];

function couponsOf(d: unknown): Coupon[] {
  return arr(isObj(d) ? d.coupons : null).map((c) => ({
    id: num(c.id),
    product_id: num(c.product_id),
    pname: str(c.pname),
    code: str(c.code),
    type: c.type === 'fixed' ? 'fixed' : 'pct',
    value: num(c.value),
    min_buy: num(c.min_buy),
    starts: str(c.starts),
    ends: str(c.ends),
    max_uses: num(c.max_uses),
    per_user: num(c.per_user),
    used: num(c.used),
    status: c.status === 'inactive' ? 'inactive' : 'active',
    state: (STATES as string[]).includes(str(c.state)) ? (str(c.state) as CouponState) : 'inactive',
  }));
}

export async function coupons(): Promise<Coupon[]> {
  return couponsOf(await api('GET', '/seller/coupons'));
}

/** Creates (id null) or updates a coupon; the server answers with the whole new list. */
export async function saveCoupon(id: number | null, body: Obj): Promise<Coupon[]> {
  return couponsOf(await api(id ? 'PUT' : 'POST', id ? `/seller/coupons/${id}` : '/seller/coupons', { body }));
}

export async function deleteCoupon(id: number): Promise<Coupon[]> {
  return couponsOf(await api('DELETE', `/seller/coupons/${id}`));
}
