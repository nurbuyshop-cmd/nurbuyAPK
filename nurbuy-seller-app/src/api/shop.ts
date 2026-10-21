import { isObj, num, str, strOrNull, type Obj } from '@/lib/guards';

import { api } from './api';
import { toSeller, type Seller } from './seller';

/* ---------- opening hours + map location ---------- */

/** 7 entries, index 0 = Sunday; [open, close] in minutes from midnight (close may be 1440 or past midnight), null = closed. */
export type Hours = { d: ([number, number] | null)[] } | null;

export function toHours(v: unknown): Hours {
  if (!isObj(v) || !Array.isArray(v.d) || v.d.length !== 7) return null;
  return { d: v.d.map((x) => (Array.isArray(x) && x.length === 2 ? [num(x[0]), num(x[1])] : null)) };
}

export async function updateShop(body: { hours?: Hours; lat?: number | null; lng?: number | null; address?: string }): Promise<Seller> {
  const d = await api('PUT', '/seller/shop', { body });
  return toSeller(isObj(d) ? d.seller : null);
}

export type MapsConfig = { key: string; mapId: string };

export async function mapsConfig(): Promise<MapsConfig> {
  const d = await api('GET', '/public/maps', { anon: true });
  const o = isObj(d) ? d : {};
  return { key: str(o.key), mapId: str(o.map_id) };
}

/* ---------- product boost ---------- */

export type AdStatus = 'pending' | 'active' | 'paused' | 'ended' | 'rejected' | 'cancelled';

export type Campaign = {
  id: number;
  product_id: number;
  status: AdStatus;
  days: number;
  daily_cap: number | null;
  start_at: number | null;
  end_at: number | null;
  imp: number;
  clicks: number;
  ctr: number;
  imp_cost: number;
  click_cost: number;
  cost: number;
  unpaid: number;
  pause_reason: string;
  reject_reason: string;
  product: { name: string; bn: string; img: string } | null;
  paid: { promo: number; wallet: number; debt: number };
};

export type AdAccount = {
  promo_total: number;
  promo_used: number;
  promo_left: number;
  debt: number;
  wallet_available: number;
  charged: number;
  can_run: boolean;
  on: boolean;
  max_days: number;
  rates: { imp1000: number; click: number };
};

export type LedgerRow = { id: number; campaign_id: number | null; kind: string; amount: number; promo: number; wallet: number; debt: number; imp: number; clicks: number; at: number };

const STATUSES: AdStatus[] = ['pending', 'active', 'paused', 'ended', 'rejected', 'cancelled'];

function toCampaign(c: Obj): Campaign {
  const p = isObj(c.product) ? c.product : null;
  const paid = isObj(c.paid) ? c.paid : {};
  const st = str(c.status);
  return {
    id: num(c.id),
    product_id: num(c.product_id),
    status: (STATUSES as string[]).includes(st) ? (st as AdStatus) : 'pending',
    days: num(c.days),
    daily_cap: c.daily_cap == null ? null : num(c.daily_cap),
    start_at: c.start_at == null ? null : num(c.start_at),
    end_at: c.end_at == null ? null : num(c.end_at),
    imp: num(c.imp),
    clicks: num(c.clicks),
    ctr: num(c.ctr),
    imp_cost: num(c.imp_cost),
    click_cost: num(c.click_cost),
    cost: num(c.cost),
    unpaid: num(c.unpaid),
    pause_reason: str(c.pause_reason),
    reject_reason: str(c.reject_reason),
    product: p ? { name: str(p.name), bn: str(p.bn), img: strOrNull(p.img) ?? '' } : null,
    paid: { promo: num(paid.promo), wallet: num(paid.wallet), debt: num(paid.debt) },
  };
}

export type Ads = { campaigns: Campaign[]; account: AdAccount; ledger: LedgerRow[] };

export async function ads(): Promise<Ads> {
  const d = await api('GET', '/seller/ads');
  const o = isObj(d) ? d : {};
  const a = isObj(o.account) ? o.account : {};
  const r = isObj(a.rates) ? a.rates : {};
  return {
    campaigns: (Array.isArray(o.campaigns) ? o.campaigns.filter(isObj) : []).map(toCampaign),
    account: {
      promo_total: num(a.promo_total),
      promo_used: num(a.promo_used),
      promo_left: num(a.promo_left),
      debt: num(a.debt),
      wallet_available: num(a.wallet_available),
      charged: num(a.charged),
      can_run: !!a.can_run,
      on: a.on === undefined ? true : !!a.on,
      max_days: num(a.max_days, 30),
      rates: { imp1000: num(r.imp1000, 10), click: num(r.click, 1) },
    },
    ledger: (Array.isArray(o.ledger) ? o.ledger.filter(isObj) : []).map((x) => ({
      id: num(x.id),
      campaign_id: x.campaign_id == null ? null : num(x.campaign_id),
      kind: str(x.kind),
      amount: num(x.amount),
      promo: num(x.promo),
      wallet: num(x.wallet),
      debt: num(x.debt),
      imp: num(x.imp),
      clicks: num(x.clicks),
      at: num(x.at),
    })),
  };
}

export async function createBoost(b: { product_id: number; days: number; daily_cap: number | null; note: string }): Promise<void> {
  await api('POST', '/seller/ads', { body: b });
}

export async function boostAction(id: number, action: 'pause' | 'resume' | 'cancel'): Promise<void> {
  await api('POST', `/seller/ads/${id}/action`, { body: { action } });
}
