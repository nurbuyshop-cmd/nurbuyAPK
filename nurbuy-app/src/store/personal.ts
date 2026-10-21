import { create } from 'zustand';

import type { Product } from '@/api/catalog';
import { saveProfile } from '@/api/profile';
import { isNum } from '@/lib/guards';
import { local } from '@/lib/storage';

import { useAuth } from './auth';
import { trackingAllowed, useConsent } from './consent';

const KEY = 'nb_last_cat';

type State = {
  /** category id the customer opened last (0 = none) */
  lastCat: number;
  hydrate: () => Promise<void>;
  remember: (cid: number) => void;
};

/**
 * "Home personalised by the last visited category": remembered on the phone and in the profile JSON after login,
 * only while the customer allows personalisation.
 */
export const usePersonal = create<State>((set, get) => ({
  lastCat: 0,
  hydrate: async () => {
    const c = await local.get(KEY, isNum);
    if (c) set({ lastCat: c });
  },
  remember: (cid) => {
    if (!cid || cid === get().lastCat || !trackingAllowed(useConsent.getState())) return;
    set({ lastCat: cid });
    void local.set(KEY, cid);
    const a = useAuth.getState();
    if (a.status === 'user') {
      const profile = { ...a.profile, lastCat: cid };
      useAuth.setState({ profile });
      saveProfile(profile).catch(() => {});
    }
  },
}));

// after login the server copy wins
useAuth.subscribe((s, prev) => {
  if (s.profile === prev.profile || !trackingAllowed(useConsent.getState())) return;
  const c = s.profile.lastCat;
  if (isNum(c) && c > 0 && c !== usePersonal.getState().lastCat) usePersonal.setState({ lastCat: c });
});

// withdrawing consent forgets the remembered category
useConsent.subscribe((s) => {
  if (!trackingAllowed(s) && usePersonal.getState().lastCat) {
    usePersonal.setState({ lastCat: 0 });
    void local.remove(KEY);
  }
});

/** Products of the remembered category (or its sub-categories) first, the rest after, order otherwise kept. */
export function personalise(list: Product[], cid: number): Product[] {
  if (!cid) return list;
  const hit = (p: Product) => p.cid === cid || p.cpath.includes(cid);
  return [...list.filter(hit), ...list.filter((p) => !hit(p))];
}
