import { isObj, isStr, num, type Obj } from './guards';

/** Banner Studio placements the app shows (same names the admin chooses). */
export type Placement = 'home' | 'home_min' | 'top_min' | 'strip_min' | 'sponsored' | 'promo' | 'category' | 'product' | 'store';

export type BsBanner = { id: number; d: Obj; w: number; h: number };

export type BsData = { banners: { id: number; pl: string[]; s: number | null; e: number | null; d: Obj }[]; fonts: unknown[] };

export function toBs(v: unknown): BsData {
  if (!isObj(v) || !Array.isArray(v.banners)) return { banners: [], fonts: [] };
  return {
    banners: v.banners
      .filter(isObj)
      .filter((b) => isObj(b.d) && Array.isArray(b.pl))
      .map((b) => ({
        id: num(b.id),
        pl: (b.pl as unknown[]).filter(isStr),
        s: b.s == null ? null : num(b.s),
        e: b.e == null ? null : num(b.e),
        d: b.d as Obj,
      })),
    fonts: Array.isArray(v.fonts) ? v.fonts : [],
  };
}

/** The phone design of a banner, else the closest one (same fallback order as the website). */
function mobileDesign(d: Obj): { w: number; h: number } | null {
  const ds = isObj(d.designs) ? d.designs : {};
  for (const k of ['mobile', 'tablet', 'desktop']) {
    const x = ds[k];
    if (isObj(x) && num(x.w) > 0 && num(x.h) > 0) return { w: num(x.w), h: num(x.h) };
  }
  return null;
}

/** Live banners for any of the placements, honouring the schedule (server time, seconds) and per-placement device lists. */
export function bannersFor(bs: BsData, placements: Placement[], nowSec: number): BsBanner[] {
  const seen = new Set<number>();
  const out: BsBanner[] = [];
  for (const b of bs.banners) {
    if (seen.has(b.id)) continue;
    if ((b.s && b.s > nowSec) || (b.e && b.e <= nowSec)) continue;
    const devs = isObj(b.d.devs) ? b.d.devs : {};
    const ok = placements.some((pl) => {
      if (!b.pl.includes(pl)) return false;
      const dd = devs[pl];
      return !Array.isArray(dd) || dd.includes('mobile');
    });
    const ds = ok ? mobileDesign(b.d) : null;
    if (ds) {
      seen.add(b.id);
      out.push({ id: b.id, d: b.d, w: ds.w, h: ds.h });
    }
  }
  return out;
}
