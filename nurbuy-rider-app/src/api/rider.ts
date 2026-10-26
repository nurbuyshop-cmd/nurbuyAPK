import { isObj, isStr, num, str, type Obj } from '@/lib/guards';

import { api } from './api';

export type RiderStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type Vehicle = 'cycle' | 'bike' | 'car';
export const VEHICLES: Vehicle[] = ['cycle', 'bike', 'car'];
export type DocKind = 'nid_front' | 'nid_back' | 'license';
/** Everything /rider/upload accepts: the profile photo and the three documents. */
export type UploadKind = 'photo' | DocKind;

export type Rider = {
  id: number;
  /** "NBR-0012" */
  code: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  nid: string;
  vehicle_type: Vehicle | '';
  vehicle_no: string;
  license_no: string;
  emerg_name: string;
  emerg_mobile: string;
  status: RiderStatus;
  reject_reason: string;
  online: boolean;
  has_photo: boolean;
  docs: Record<DocKind, boolean>;
  /** mobile / email / vehicle changes waiting for admin approval */
  chg: Record<string, string> | null;
  created_at: number;
};

const STATUSES: RiderStatus[] = ['pending', 'approved', 'rejected', 'suspended'];

export const isVehicle = (v: unknown): v is Vehicle => v === 'cycle' || v === 'bike' || v === 'car';

export function toRider(v: unknown): Rider {
  const o = isObj(v) ? v : {};
  const docs = isObj(o.docs) ? o.docs : {};
  const st = str(o.status);
  const chg = isObj(o.chg) ? Object.fromEntries(Object.entries(o.chg).map(([k, x]) => [k, str(x)])) : null;
  return {
    id: num(o.id),
    code: str(o.code),
    name: str(o.name),
    mobile: str(o.mobile),
    email: str(o.email),
    address: str(o.address),
    nid: str(o.nid),
    vehicle_type: isVehicle(o.vehicle_type) ? o.vehicle_type : '',
    vehicle_no: str(o.vehicle_no),
    license_no: str(o.license_no),
    emerg_name: str(o.emerg_name),
    emerg_mobile: str(o.emerg_mobile),
    status: (STATUSES as string[]).includes(st) ? (st as RiderStatus) : 'pending',
    reject_reason: str(o.reject_reason),
    online: !!num(o.online),
    has_photo: !!o.has_photo,
    docs: { nid_front: !!docs.nid_front, nid_back: !!docs.nid_back, license: !!docs.license },
    chg: chg && Object.keys(chg).length ? chg : null,
    created_at: num(o.created_at),
  };
}

export const isRider = (v: unknown): v is Rider => isObj(v) && typeof v.id === 'number' && typeof v.name === 'string' && isObj(v.docs);

const riderOf = (d: unknown): Rider => toRider(isObj(d) ? d.rider : null);

/** The documents a rider needs: a bicycle needs no driving license. */
export const docKindsFor = (vt: string): DocKind[] => (vt === 'cycle' ? ['nid_front', 'nid_back'] : ['nid_front', 'nid_back', 'license']);

/* ---------- auth ---------- */

export async function login(id: string, password: string): Promise<{ token: string; rider: Rider }> {
  const d = await api('POST', '/rider/login', { body: { id, password }, anon: true });
  const o = isObj(d) ? d : {};
  return { token: str(o.token), rider: riderOf(o) };
}

export type SignupBody = {
  name: string;
  mobile: string;
  email: string;
  address: string;
  nid: string;
  vehicle_type: Vehicle;
  vehicle_no: string;
  license_no: string;
  emerg_name: string;
  emerg_mobile: string;
  password: string;
};

export async function signup(b: SignupBody): Promise<{ token: string; rider: Rider }> {
  const d = await api('POST', '/rider/signup', { body: b, anon: true });
  const o = isObj(d) ? d : {};
  return { token: str(o.token), rider: riderOf(o) };
}

export async function logout(): Promise<void> {
  await api('POST', '/rider/logout');
}

export async function me(): Promise<Rider> {
  return riderOf(await api('GET', '/rider/me'));
}

/** Pending / rejected: free edit. Approved: address and emergency contact change at once, the rest waits for admin. */
export async function updateMe(body: Obj): Promise<Rider> {
  return riderOf(await api('PUT', '/rider/me', { body }));
}

export async function reapply(): Promise<Rider> {
  return riderOf(await api('POST', '/rider/reapply'));
}

export async function changePassword(current: string, password: string): Promise<void> {
  await api('POST', '/rider/password', { body: { current, password } });
}

/* ---------- uploads ---------- */

export type LocalFile = { uri: string; name: string; type: string };

/** Sends the profile photo or a document to /rider/upload; the server answers with the updated rider. */
export async function upload(kind: UploadKind, file: LocalFile, onProgress?: (p: number) => void): Promise<Rider> {
  const form = new FormData();
  form.append('kind', kind);
  // React Native's FormData file part
  form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  return riderOf(await api('POST', '/rider/upload', { form, onProgress }));
}

/** Private file path for fetchPrivateFile (photo or document). */
export const filePath = (kind: UploadKind) => `/rider/file?kind=${kind}`;

/* ---------- online / dashboard ---------- */

export async function setOnline(online: boolean): Promise<boolean> {
  const d = await api('POST', '/rider/online', { body: { online } });
  return isObj(d) && !!num(d.online);
}

export type Dashboard = {
  rider: Rider | null;
  pending: number;
  active: number;
  today: number;
  completed_today: number;
  cancelled_today: number;
  completed_total: number;
  cash_today: number;
  earn: { today: number; month: number } | null;
  unread: number;
  /** the newest running delivery */
  active_order: RiderOrder | null;
};

export async function dashboard(): Promise<Dashboard> {
  const d = await api('GET', '/rider/dashboard');
  const o = isObj(d) ? d : {};
  const e = isObj(o.earn) ? o.earn : null;
  return {
    rider: isObj(o.rider) ? toRider(o.rider) : null,
    pending: num(o.pending),
    active: num(o.active),
    today: num(o.today),
    completed_today: num(o.completed_today),
    cancelled_today: num(o.cancelled_today),
    completed_total: num(o.completed_total),
    cash_today: num(o.cash_today),
    earn: e ? { today: num(e.today), month: num(e.month) } : null,
    unread: num(o.unread),
    active_order: isObj(o.active_order) ? toOrder(o.active_order) : null,
  };
}

/* ---------- orders ---------- */

/** Delivery step of the rider (deliveries.rstat). */
export type RStat = 'assigned' | 'accepted' | 'going' | 'picked' | 'ontheway' | 'arrived' | 'delivered' | 'failed' | 'rejected' | 'cancelled';
const RSTATS: RStat[] = ['assigned', 'accepted', 'going', 'picked', 'ontheway', 'arrived', 'delivered', 'failed', 'rejected', 'cancelled'];
export const ACTIVE_RSTATS: RStat[] = ['accepted', 'going', 'picked', 'ontheway', 'arrived'];
export const isFinal = (rs: RStat) => rs === 'delivered' || rs === 'failed' || rs === 'cancelled' || rs === 'rejected';

export type OrderItem = { n: string; bn: string; e: string; q: number; unit: number; total: number; variant: string; img: string };

export type Pickup = {
  name: string;
  logo: string;
  photo: string;
  owner: string;
  mobile: string;
  address: string;
  lat: number | null;
  lng: number | null;
  /** Google Maps directions / search links */
  nav: string;
  map: string;
  items: OrderItem[];
};

export type Delay = { mins: number; label: string; note: string };
export type Eta = { mins: number; extra: number; due: number; delays: Delay[] };
export type Live = { lat: number; lng: number; at: number; fresh: boolean; nav: string };
export type Geo = { area: string; city: string; post: string; landmark: string };
export type Zone = { n: string; bn: string };

export type RiderOrder = {
  id: string;
  /** 'min' = NurBuy Minutes */
  view: string;
  rstat: RStat;
  fail_reason: string;
  customer: { name: string; mobile: string };
  pickup: { name: string };
  pickups: Pickup[];
  multi: boolean;
  area: { n: string; bn: string }[];
  delivery: { address: string; lat: number | null; lng: number | null; geo: Geo | null; zone: Zone | null };
  live: Live | null;
  items: OrderItem[];
  sub: number;
  fee: number;
  total: number;
  pay: string;
  collect: number;
  ordered_at: number;
  deadline: number | null;
  eta: Eta | null;
  delay_left: number;
  rider_pay: number | null;
  note: string;
  updated_at: number;
  nav_delivery: string;
  nav_pickup: string;
};

const numOr = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
/** Only Google Maps links are opened (website safeNav()). */
const gmaps = (v: unknown): string => (isStr(v) && /^https:\/\/www\.google\.com\/maps\//.test(v) ? v : '');
/** Only http(s) images are shown (website safeImg()). */
const httpUrl = (v: unknown): string => (isStr(v) && /^https?:\/\//.test(v) ? v : '');

function toItem(v: unknown): OrderItem {
  const i = isObj(v) ? v : {};
  const q = num(i.q, 1);
  const unit = num(i.unit);
  return { n: str(i.n), bn: str(i.bn), e: str(i.e), q, unit, total: i.total == null ? unit * q : num(i.total), variant: str(i.variant), img: httpUrl(i.img) };
}

function toPickup(v: unknown): Pickup {
  const p = isObj(v) ? v : {};
  return {
    name: str(p.name),
    logo: httpUrl(p.logo),
    photo: httpUrl(p.photo),
    owner: str(p.owner),
    mobile: str(p.mobile),
    address: str(p.address),
    lat: numOr(p.lat),
    lng: numOr(p.lng),
    nav: gmaps(p.nav),
    map: gmaps(p.map),
    items: Array.isArray(p.items) ? p.items.map(toItem) : [],
  };
}

export function toOrder(v: unknown): RiderOrder {
  const o = isObj(v) ? v : {};
  const rs = str(o.rstat);
  const cu = isObj(o.customer) ? o.customer : {};
  const pk = isObj(o.pickup) ? o.pickup : {};
  const dl = isObj(o.delivery) ? o.delivery : {};
  const g = isObj(dl.geo) ? dl.geo : null;
  const z = isObj(dl.zone) ? dl.zone : null;
  const lv = isObj(o.live) ? o.live : null;
  const e = isObj(o.eta) ? o.eta : null;
  return {
    id: str(o.id),
    view: str(o.view),
    rstat: (RSTATS as string[]).includes(rs) ? (rs as RStat) : 'assigned',
    fail_reason: str(o.fail_reason),
    customer: { name: str(cu.name), mobile: str(cu.mobile) },
    pickup: { name: str(pk.name) },
    pickups: Array.isArray(o.pickups) ? o.pickups.map(toPickup) : [],
    multi: !!o.multi,
    area: Array.isArray(o.area) ? o.area.filter(isObj).map((x) => ({ n: str(x.n), bn: str(x.bn) })) : [],
    delivery: {
      address: str(dl.address),
      lat: numOr(dl.lat),
      lng: numOr(dl.lng),
      geo: g ? { area: str(g.area), city: str(g.city), post: str(g.post), landmark: str(g.landmark) } : null,
      zone: z ? { n: str(z.n), bn: str(z.bn) } : null,
    },
    live: lv && numOr(lv.lat) !== null && numOr(lv.lng) !== null
      ? { lat: num(lv.lat), lng: num(lv.lng), at: num(lv.at), fresh: !!lv.fresh, nav: gmaps(lv.nav) }
      : null,
    items: Array.isArray(o.items) ? o.items.map(toItem) : [],
    sub: num(o.sub),
    fee: num(o.fee),
    total: num(o.total),
    pay: str(o.pay),
    collect: num(o.collect),
    ordered_at: num(o.ordered_at),
    deadline: numOr(o.deadline),
    eta: e
      ? {
          mins: num(e.mins),
          extra: num(e.extra),
          due: num(e.due),
          delays: Array.isArray(e.delays) ? e.delays.filter(isObj).map((d) => ({ mins: num(d.mins), label: str(d.label), note: str(d.note) })) : [],
        }
      : null,
    delay_left: num(o.delay_left),
    rider_pay: numOr(o.rider_pay),
    note: str(o.note),
    updated_at: num(o.updated_at),
    nav_delivery: gmaps(o.nav_delivery),
    nav_pickup: gmaps(o.nav_pickup),
  };
}

export async function orders(tab: 'pending' | 'active'): Promise<RiderOrder[]> {
  const d = await api('GET', `/rider/orders?tab=${tab}`);
  return isObj(d) && Array.isArray(d.orders) ? d.orders.map(toOrder) : [];
}

export async function order(id: string): Promise<RiderOrder> {
  const d = await api('GET', `/rider/orders/${encodeURIComponent(id)}`);
  return toOrder(isObj(d) ? d.order : null);
}

const orderPath = (id: string, action: string) => `/rider/orders/${encodeURIComponent(id)}/${action}`;

export async function acceptOrder(id: string): Promise<void> {
  await api('POST', orderPath(id, 'accept'));
}

export async function rejectOrder(id: string): Promise<void> {
  await api('POST', orderPath(id, 'reject'));
}

export async function stepOrder(id: string, to: 'going' | 'picked' | 'ontheway' | 'arrived'): Promise<void> {
  await api('POST', orderPath(id, 'status'), { body: { to } });
}

export async function deliverOrder(id: string, otp: string): Promise<void> {
  await api('POST', orderPath(id, 'deliver'), { body: { otp } });
}

export const FAIL_REASONS = ['customer_unreachable', 'customer_not_home', 'wrong_address', 'customer_refused', 'vehicle_problem', 'other'] as const;
export type FailReason = (typeof FAIL_REASONS)[number];

export async function failOrder(id: string, reason: FailReason, note: string): Promise<void> {
  await api('POST', orderPath(id, 'fail'), { body: note ? { reason, note } : { reason } });
}

export const DELAY_REASONS = ['traffic', 'weather', 'shop', 'address', 'vehicle', 'other'] as const;
export type DelayReason = (typeof DELAY_REASONS)[number];

export async function askDelay(id: string, reason: DelayReason, note: string, mins: number): Promise<void> {
  await api('POST', orderPath(id, 'delay'), { body: { reason, note, mins } });
}

export const REPORT_REASONS = ['fake_order', 'repeated_failed', 'wrong_contact', 'other'] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** Uploads one proof photo; the server answers with its private file name. */
export async function uploadEvidence(file: LocalFile): Promise<string> {
  const form = new FormData();
  form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  const d = await api('POST', '/rider/reports/upload', { form });
  return isObj(d) ? str(d.name) : '';
}

export async function reportCustomer(id: string, reason: ReportReason, note: string, evidence: string[]): Promise<void> {
  await api('POST', orderPath(id, 'report'), { body: note ? { reason, note, evidence } : { reason, evidence } });
}

/* ---------- history / cash ---------- */

export type Range = 'today' | 'yesterday' | 'week' | 'month' | 'custom';
export type HistSt = 'all' | 'completed' | 'cancelled' | 'failed';

/** Finished deliveries (website loadHist()); from / to are YYYY-MM-DD for a custom range. */
export async function history(range: Range, st: HistSt, from: string, to: string): Promise<RiderOrder[]> {
  let q = `tab=history&range=${range}`;
  if (st !== 'all') q += `&st=${st}`;
  if (range === 'custom') {
    if (from) q += `&from=${from}`;
    if (to) q += `&to=${to}`;
  }
  const d = await api('GET', `/rider/orders?${q}`);
  return isObj(d) && Array.isArray(d.orders) ? d.orders.map(toOrder) : [];
}

export type Cash = {
  total: number;
  count: number;
  days: { date: string; total: number; count: number }[];
  orders: { id: string; cod: number; cu: string; at: number }[];
};

export async function cash(range: Exclude<Range, 'custom'>): Promise<Cash> {
  const d = await api('GET', `/rider/cash?range=${range}`);
  const o = isObj(d) ? d : {};
  return {
    total: num(o.total),
    count: num(o.count),
    days: Array.isArray(o.days) ? o.days.filter(isObj).map((x) => ({ date: str(x.date), total: num(x.total), count: num(x.count) })) : [],
    orders: Array.isArray(o.orders) ? o.orders.filter(isObj).map((x) => ({ id: str(x.id), cod: num(x.cod), cu: str(x.cu), at: num(x.at) })) : [],
  };
}

/* ---------- earnings / withdrawals ---------- */

export type Earnings = {
  summary: { total: number; today: number; week: number; month: number; count: number };
  items: { order_id: string; amount: number; area: string; at: number }[];
};

export async function earnings(): Promise<Earnings> {
  const d = await api('GET', '/rider/earnings');
  const o = isObj(d) ? d : {};
  const s = isObj(o.summary) ? o.summary : {};
  return {
    summary: { total: num(s.total), today: num(s.today), week: num(s.week), month: num(s.month), count: num(s.count) },
    items: Array.isArray(o.items) ? o.items.filter(isObj).map((x) => ({ order_id: str(x.order_id), amount: num(x.amount), area: str(x.area), at: num(x.at) })) : [],
  };
}

export type WdStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
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
  pay_ref: string;
  paid_at: number | null;
  created_at: number;
};

export type Wallet = {
  summary: { total: number; available: number; wd_pending: number; withdrawn: number; min: number };
  withdrawals: Withdrawal[];
  payout: { last?: 'bkash' | 'bank'; bkash?: Partial<BkashDetails>; bank?: Partial<BankDetails> };
};

const strMap = (v: unknown): Record<string, string> => (isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, str(x)])) : {});

function toWithdrawal(v: unknown): Withdrawal {
  const w = isObj(v) ? v : {};
  const st = str(w.status);
  return {
    id: num(w.id),
    no: str(w.no),
    amount: num(w.amount),
    method: w.method === 'bank' ? 'bank' : 'bkash',
    details: strMap(w.details),
    status: st === 'processing' || st === 'completed' || st === 'cancelled' ? st : 'pending',
    reason: str(w.reason),
    pay_ref: str(w.pay_ref),
    paid_at: w.paid_at == null ? null : num(w.paid_at),
    created_at: num(w.created_at),
  };
}

export async function wallet(): Promise<Wallet> {
  const d = await api('GET', '/rider/wallet');
  const o = isObj(d) ? d : {};
  const s = isObj(o.summary) ? o.summary : {};
  const po = isObj(o.payout) ? o.payout : {};
  return {
    summary: { total: num(s.total), available: num(s.available), wd_pending: num(s.wd_pending), withdrawn: num(s.withdrawn), min: num(s.min) },
    withdrawals: Array.isArray(o.withdrawals) ? o.withdrawals.map(toWithdrawal) : [],
    payout: {
      last: po.last === 'bank' || po.last === 'bkash' ? po.last : undefined,
      bkash: isObj(po.bkash) ? (strMap(po.bkash) as Partial<BkashDetails>) : undefined,
      bank: isObj(po.bank) ? (strMap(po.bank) as Partial<BankDetails>) : undefined,
    },
  };
}

export async function requestWithdraw(amount: number, method: 'bkash' | 'bank', details: BkashDetails | BankDetails): Promise<Withdrawal> {
  const d = await api('POST', '/rider/withdrawals', { body: { amount, method, details } });
  return toWithdrawal(isObj(d) ? d.withdrawal : null);
}

export async function withdrawal(id: number): Promise<Withdrawal> {
  const d = await api('GET', `/rider/withdrawals/${id}`);
  return toWithdrawal(isObj(d) ? d.withdrawal : null);
}

/** Google Maps key for the order map (the same one the website uses). */
export async function mapsConfig(): Promise<{ key: string; mapId: string }> {
  const d = await api('GET', '/public/maps', { anon: true });
  const o = isObj(d) ? d : {};
  return { key: str(o.key), mapId: str(o.map_id) };
}

/* ---------- notifications ---------- */

export type RiderNotif = { id: number; title: string; body: string; read: boolean; at: number; url: string; kind: string };

export async function notifications(): Promise<{ list: RiderNotif[]; unread: number }> {
  const d = await api('GET', '/rider/notifications');
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
  await api('POST', '/rider/notifications/read');
}
