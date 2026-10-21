import { create } from 'zustand';

import { checkZone, fetchAreas, fetchZones, toAreas, toZones, type Areas, type Place, type ZoneQuote, type Zones } from '@/api/geo';
import { isNum, isObj, isStr, type Obj } from '@/lib/guards';
import { local } from '@/lib/storage';

const K_AREAS = 'nb_geo';
const K_ZONES = 'nb_zones';
const K_SEL = 'nb_loc';
const K_PIN = 'nb_pin';
const K_LINE = 'nb_addr_line';

/** Map pin with the address details Google returned (sent to the server as extra.geo). */
export type Pin = { lat: number; lng: number; acc?: number; full?: string; area?: string; city?: string; district?: string; postcode?: string; country?: string; place_id?: string; landmark?: string };

const isIds = (v: unknown): v is number[] => Array.isArray(v) && v.every(isNum);
const isPin = (v: unknown): v is Pin => isObj(v) && isNum(v.lat) && isNum(v.lng);

type State = {
  areas: Areas | null;
  zones: Zones | null;
  /** chosen place ids from the top: [district, thana, village] */
  sel: number[];
  pin: Pin | null;
  /** the customer's own words: house, road, building */
  line: string;
  setLine: (s: string) => void;
  /** price and zone for the pin (zones mode) */
  quote: ZoneQuote | null;
  /** the pin is outside every delivery zone */
  outside: boolean;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  setSel: (ids: number[]) => void;
  setPin: (pin: Pin) => Promise<void>;
  /** asks the server again for the pin's price with the current cart */
  requote: (sub: number, items: { id: string; shop: string }[]) => Promise<ZoneQuote | null>;
};

export const useLocation = create<State>((set, get) => ({
  areas: null,
  zones: null,
  sel: [],
  pin: null,
  line: '',
  quote: null,
  outside: false,

  setLine: (line) => {
    set({ line });
    void local.set(K_LINE, line);
  },

  hydrate: async () => {
    const [a, z, sel, pin, line] = await Promise.all([
      local.get(K_AREAS, (v): v is unknown => v !== null),
      local.get(K_ZONES, (v): v is unknown => v !== null),
      local.get(K_SEL, isIds),
      local.get(K_PIN, isPin),
      local.get(K_LINE, isStr),
    ]);
    set({ areas: a ? toAreas(a) : null, zones: z ? toZones(z) : null, sel: sel ?? [], pin: pin ?? null, line: line ?? '' });
    void get().refresh();
  },

  refresh: async () => {
    const [a, z] = await Promise.allSettled([fetchAreas(), fetchZones()]);
    if (a.status === 'fulfilled') {
      set({ areas: a.value });
      void local.set(K_AREAS, { min: { d: a.value.districts.map(raw), c: Object.fromEntries(Object.entries(a.value.kids).map(([k, l]) => [k, l.map(raw)])), need: a.value.need, def: a.value.def, eta: a.value.eta, free: a.value.free } });
      // a place the admin switched off is forgotten
      const sel = validSel(a.value, get().sel);
      if (sel.length !== get().sel.length) get().setSel(sel);
    }
    if (z.status === 'fulfilled') {
      set({ zones: z.value });
      void local.set(K_ZONES, { active: z.value.active, default_fee: z.value.defFee, default_eta: z.value.defEta, free_over: z.value.freeOver, zones: z.value.zones });
    }
    if (get().pin && get().zones?.active) void get().requote(0, []);
  },

  setSel: (ids) => {
    set({ sel: ids });
    void local.set(K_SEL, ids);
  },

  setPin: async (pin) => {
    set({ pin });
    void local.set(K_PIN, pin);
    await get().requote(0, []);
  },

  requote: async (sub, items) => {
    const pin = get().pin;
    if (!pin || !get().zones?.active) return null;
    try {
      const q = await checkZone(pin.lat, pin.lng, sub, items);
      set({ quote: q.inside ? q : null, outside: !q.inside });
      return q;
    } catch {
      return get().quote;
    }
  },
}));

const raw = (p: Place) => [p.id, p.n, p.bn, p.fee, p.eta];

/** Keeps only the leading ids that still exist in the area tree. */
function validSel(a: Areas, sel: number[]): number[] {
  const out: number[] = [];
  let list = a.districts;
  for (const id of sel) {
    if (!list.some((p) => p.id === id)) break;
    out.push(id);
    list = a.kids[String(id)] ?? [];
  }
  return out;
}

/** The chosen places from district down. */
export function selectedPlaces(a: Areas | null, sel: number[]): Place[] {
  if (!a) return [];
  const out: Place[] = [];
  let list = a.districts;
  for (const id of sel) {
    const p = list.find((x) => x.id === id);
    if (!p) break;
    out.push(p);
    list = a.kids[String(id)] ?? [];
  }
  return out;
}

/** All levels the server requires have been chosen. */
export function areaComplete(a: Areas | null, sel: number[]): boolean {
  return !!a && selectedPlaces(a, sel).length >= a.need;
}

/** "Village, Thana, District" in the current language (most specific first). */
export function placeText(places: Place[], lang: 'en' | 'bn'): string {
  return [...places].reverse().map((p) => (lang === 'bn' ? p.bn : p.n)).join(', ');
}

/**
 * Short "deliver to" text for the home header: the address line, then village and thana.
 * Zones mode falls back to the pin's own names, the zone name and the map address (Google may return no names at all).
 */
export function deliverText(s: Pick<State, 'areas' | 'zones' | 'sel' | 'pin' | 'line' | 'quote'>, lang: 'en' | 'bn'): string {
  const area = placeText(selectedPlaces(s.areas, s.sel).slice(-2), lang);
  const zone = s.quote?.zone ? (lang === 'bn' ? s.quote.zone.bn || s.quote.zone.name : s.quote.zone.name) : '';
  const main = s.zones?.active && s.pin ? area || s.pin.area || s.pin.city || zone || s.pin.full || '' : area;
  return [s.line.trim(), main].filter(Boolean).join(', ');
}

/** The pin details in the shape the server cleans (geo_clean). */
export function pinForOrder(p: Pin): Obj {
  const o: Obj = { lat: p.lat, lng: p.lng };
  for (const k of ['full', 'area', 'city', 'district', 'postcode', 'country', 'place_id', 'landmark'] as const) if (isStr(p[k]) && p[k]) o[k] = p[k];
  if (isNum(p.acc)) o.acc = p.acc;
  return o;
}
