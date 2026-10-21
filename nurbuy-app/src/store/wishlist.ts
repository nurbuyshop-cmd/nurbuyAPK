import { create } from 'zustand';

import type { Product } from '@/api/catalog';
import { saveProfile } from '@/api/profile';
import { isObj, isStr, type Obj } from '@/lib/guards';

import { useAuth } from './auth';

/** Same key the website stores in the profile's "wl" list, so both stay in sync. */
export const wishKey = (p: Product) => 'min' + p.n;

/** The product is saved in the default list or any named list. */
export const isWished = (s: { keys: string[]; lists: { ks: string[] }[] }, key: string) => s.keys.includes(key) || s.lists.some((l) => l.ks.includes(key));

/** A named list (profile "wls": {lists:[{id, n, ks, v}]}). */
export type WishList = { id: string; n: string; ks: string[] };

type State = {
  /** the default list */
  keys: string[];
  lists: WishList[];
  toggle: (p: Product) => boolean;
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  /** moves a saved product between the default list ("d") and named lists */
  move: (key: string, from: string, to: string) => void;
};

/** Saved products. The server copy (profile.wl / profile.wls) wins after login; every change writes it back. */
export const useWishlist = create<State>((set, get) => ({
  keys: [],
  lists: [],
  toggle: (p) => {
    const k = wishKey(p);
    const on = !get().keys.includes(k) && !get().lists.some((l) => l.ks.includes(k));
    const keys = on ? [k, ...get().keys].slice(0, 500) : get().keys.filter((x) => x !== k);
    const lists = on ? get().lists : get().lists.map((l) => ({ ...l, ks: l.ks.filter((x) => x !== k) }));
    set({ keys, lists });
    push();
    return on;
  },
  createList: (name) => {
    set({ lists: [...get().lists, { id: 'l' + Date.now().toString(36), n: name.slice(0, 40), ks: [] }] });
    push();
  },
  deleteList: (id) => {
    set({ lists: get().lists.filter((l) => l.id !== id) });
    push();
  },
  move: (key, from, to) => {
    if (from === to) return;
    let keys = get().keys;
    let lists = get().lists;
    if (from === 'd') keys = keys.filter((x) => x !== key);
    else lists = lists.map((l) => (l.id === from ? { ...l, ks: l.ks.filter((x) => x !== key) } : l));
    if (to === 'd') keys = [key, ...keys];
    else lists = lists.map((l) => (l.id === to ? { ...l, ks: [key, ...l.ks] } : l));
    set({ keys, lists });
    push();
  },
}));

/** Writes both lists into the customer's profile on the server. */
function push() {
  const auth = useAuth.getState();
  if (auth.status !== 'user') return;
  const { keys, lists } = useWishlist.getState();
  const profile: Obj = { ...auth.profile, wl: keys, wls: { lists: lists.map((l) => ({ ...l, v: 'min' })) } };
  useAuth.setState({ profile });
  saveProfile(profile).catch(() => {
    // kept on the phone; the next change sends everything again
  });
}

function readLists(v: unknown): WishList[] {
  if (!isObj(v) || !Array.isArray(v.lists)) return [];
  return v.lists
    .filter(isObj)
    .filter((l) => l.v === undefined || l.v === 'min')
    .map((l) => ({ id: isStr(l.id) ? l.id : String(l.id ?? ''), n: isStr(l.n) ? l.n : '', ks: Array.isArray(l.ks) ? l.ks.filter(isStr) : [] }))
    .filter((l) => l.id);
}

// the signed-in customer's profile carries the wishlist; a guest has none (the heart asks to log in)
useAuth.subscribe((s, prev) => {
  if (s.profile === prev.profile && s.status === prev.status) return;
  const user = s.status === 'user';
  const keys = user && Array.isArray(s.profile.wl) ? s.profile.wl.filter(isStr) : [];
  const lists = user ? readLists(s.profile.wls) : [];
  const cur = useWishlist.getState();
  if (JSON.stringify([keys, lists]) !== JSON.stringify([cur.keys, cur.lists])) useWishlist.setState({ keys, lists });
});
