import { isNum, isObj, num, numOrNull, str } from '@/lib/guards';

import { api } from './api';

/** One place in the delivery-area tree. Villages (level 3) may carry their own charge and minutes. */
export type Place = { id: number; n: string; bn: string; fee: number | null; eta: number | null };

export type Areas = {
  districts: Place[];
  /** parent id -> children */
  kids: Record<string, Place[]>;
  /** levels the customer must choose (3 = district, thana, village) */
  need: number;
  /** default delivery charge, minutes and free-delivery amount */
  def: number;
  eta: number;
  free: number | null;
};

function toPlace(v: unknown): Place | null {
  if (!Array.isArray(v) || !isNum(v[0])) return null;
  return { id: v[0], n: str(v[1]), bn: str(v[2]) || str(v[1]), fee: numOrNull(v[3]), eta: numOrNull(v[4]) };
}

const places = (v: unknown): Place[] => (Array.isArray(v) ? v.map(toPlace).filter((p): p is Place => !!p) : []);

export function toAreas(v: unknown): Areas | null {
  const m = isObj(v) && isObj(v.min) ? v.min : null;
  if (!m) return null;
  const kids: Record<string, Place[]> = {};
  if (isObj(m.c)) for (const [k, x] of Object.entries(m.c)) kids[k] = places(x);
  return {
    districts: places(m.d),
    kids,
    need: num(m.need, 3),
    def: num(m.def, 30),
    eta: num(m.eta, 59),
    free: m.free === null || m.free === undefined ? null : num(m.free),
  };
}

export async function fetchAreas(): Promise<Areas> {
  const a = toAreas(await api('GET', '/geo'));
  if (!a) throw new Error('Unexpected areas');
  return a;
}

export type Zone = { id: number; name: string; bn: string; color: string; poly: [number, number][] };

export type Zones = { active: boolean; defFee: number; defEta: number; freeOver: number | null; zones: Zone[] };

export function toZones(v: unknown): Zones | null {
  if (!isObj(v)) return null;
  const zones: Zone[] = Array.isArray(v.zones)
    ? v.zones.filter(isObj).map((z) => ({
        id: num(z.id),
        name: str(z.name),
        bn: str(z.bn) || str(z.name),
        color: str(z.color, '#1d2fe0'),
        poly: Array.isArray(z.poly) ? z.poly.filter((p): p is [number, number] => Array.isArray(p) && isNum(p[0]) && isNum(p[1])).map((p) => [p[0], p[1]]) : [],
      }))
    : [];
  return { active: v.active === true, defFee: num(v.default_fee, 30), defEta: num(v.default_eta, 59), freeOver: v.free_over == null ? null : num(v.free_over), zones };
}

export async function fetchZones(): Promise<Zones> {
  const z = toZones(await api('GET', '/public/zones'));
  if (!z) throw new Error('Unexpected zones');
  return z;
}

/** Server answer for a pin: inside a zone or not, and the price for this cart. */
export type ZoneQuote = {
  inside: boolean;
  /** district / thana / village: the area names the admin gave the zone (may be empty) */
  zone: { id: number; name: string; bn: string; district?: string; thana?: string; village?: string } | null;
  fee: number;
  free: boolean;
  eta: number;
  minOrder: number | null;
  minOk: boolean;
  freeOver: number | null;
};

export async function checkZone(lat: number, lng: number, sub: number, items: { id: string; shop: string }[]): Promise<ZoneQuote> {
  const r = await api('POST', '/public/zones/check', { body: { lat, lng, sub, items } });
  const o = isObj(r) ? r : {};
  const z = isObj(o.zone) ? o.zone : null;
  return {
    inside: o.inside === true,
    zone: z
      ? { id: num(z.id), name: str(z.name), bn: str(z.bn) || str(z.name), district: str(z.district), thana: str(z.thana), village: str(z.village) }
      : null,
    fee: num(o.fee),
    free: o.free === true,
    eta: num(o.eta, 59),
    minOrder: numOrNull(o.min_order),
    minOk: o.min_ok !== false,
    freeOver: o.free_over == null ? null : num(o.free_over),
  };
}

export type MapsConfig = { key: string; mapId: string; centers: { id: string; en: string; bn: string; lat: number; lng: number; zoom: number }[] };

export async function fetchMapsConfig(): Promise<MapsConfig> {
  const r = await api('GET', '/public/maps');
  const o = isObj(r) ? r : {};
  return {
    key: str(o.key),
    mapId: str(o.map_id),
    centers: Array.isArray(o.centers)
      ? o.centers.filter(isObj).map((c) => ({ id: str(c.id), en: str(c.en), bn: str(c.bn), lat: num(c.lat), lng: num(c.lng), zoom: num(c.zoom, 13) }))
      : [],
  };
}
