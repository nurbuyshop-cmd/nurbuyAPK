import { create } from 'zustand';

import * as sellerApi from '@/api/seller';
import type { Dashboard } from '@/api/seller';
import { playNewOrder } from '@/lib/sound';

import { useAuth } from './auth';

type State = {
  dash: Dashboard | null;
  unread: number;
  /** grows by one after every dashboard refresh (the 20-second check): open order pages refresh with it */
  tick: number;
  /** new-order count seen last time; null before the first load */
  prevNew: number | null;
  /** a "new order" message to show on top of any page */
  alert: number;
  load: () => Promise<Dashboard>;
  setUnread: (n: number) => void;
  reset: () => void;
};

/** The dashboard numbers and the unread count, shared by the home page, badges and the 20-second check. */
export const useDash = create<State>((set, get) => ({
  dash: null,
  unread: 0,
  tick: 0,
  prevNew: null,
  alert: 0,

  load: async () => {
    const d = await sellerApi.dashboard();
    if (!useAuth.getState().token) return d;
    const prev = get().prevNew;
    const more = prev !== null && d.stats.new > prev;
    set((s) => ({
      dash: d,
      unread: d.unread,
      prevNew: d.stats.new,
      tick: s.tick + 1,
      alert: more ? s.alert + 1 : s.alert,
    }));
    if (more) playNewOrder();
    return d;
  },

  setUnread: (n) => set({ unread: n }),

  reset: () => set({ dash: null, unread: 0, prevNew: null }),
}));

// a different seller on this phone must never see the previous shop's numbers
useAuth.subscribe((s, p) => {
  if (s.token !== p.token) useDash.getState().reset();
});
