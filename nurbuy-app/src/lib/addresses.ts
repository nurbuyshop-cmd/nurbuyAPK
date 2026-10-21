import { saveProfile } from '@/api/profile';
import { useAuth } from '@/store/auth';
import type { Pin } from '@/store/location';

import { isNum, isObj, isStr, type Obj } from './guards';

/**
 * The parts of a saved address, kept in profile.addrX next to its text (profile.addr, which the website reads),
 * so the location page can open it again with the same pin, lists and lines.
 */
export type AddrParts = { t: string; sel: number[]; area: string; det: string; pin?: Pin };

export const isAddrParts = (v: unknown): v is AddrParts =>
  isObj(v) && isStr(v.t) && Array.isArray(v.sel) && v.sel.every((x) => typeof x === 'number') && isStr(v.area) && isStr(v.det);

const isPin = (v: unknown): v is Pin => isObj(v) && isNum(v.lat) && isNum(v.lng);

export function savedAddresses(profile: Obj): { list: string[]; parts: AddrParts[] } {
  const list = Array.isArray(profile.addr) ? profile.addr.filter(isStr) : [];
  const parts = Array.isArray(profile.addrX)
    ? profile.addrX.filter(isAddrParts).map((p) => (isPin(p.pin) ? p : { t: p.t, sel: p.sel, area: p.area, det: p.det }))
    : [];
  return { list, parts };
}

/** Adds (index -1) or replaces a saved address; returns false when the server could not save it. */
export async function storeAddress(index: number, p: AddrParts): Promise<boolean> {
  const auth = useAuth.getState();
  const before = auth.profile;
  const { list, parts } = savedAddresses(before);
  const next = [...list];
  const old = index >= 0 ? list[index] : undefined;
  if (index < 0 || index >= list.length) next.push(p.t);
  else next[index] = p.t;
  const nextParts = [...parts.filter((x) => next.includes(x.t) && x.t !== old), p];
  const profile = { ...before, addr: next, addrX: nextParts };
  auth.setProfile(profile);
  try {
    await saveProfile(profile);
    return true;
  } catch {
    auth.setProfile(before);
    return false;
  }
}
