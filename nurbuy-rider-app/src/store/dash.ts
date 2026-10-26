import { create } from 'zustand';

import * as riderApi from '@/api/rider';
import type { Dashboard } from '@/api/rider';
import { ApiError } from '@/api/api';
import { playNewOrder } from '@/lib/sound';

import { useAuth } from './auth';

type State = {
  dash: Dashboard | null;
  unread: number;
  /** grows by one after every dashboard refresh (the 15-second check): open order pages refresh with it */
  tick: number;
  /** pending-assignment count seen last time; null before the first load */
  prevPending: number | null;
  /** a "new order assigned" message to show on top of any page; holds how many arrived */
  alert: { id: number; count: number };
  load: () => Promise<Dashboard>;
  setUnread: (n: number) => void;
  reset: () => void;
};

/** The dashboard numbers and the unread count, shared by the home page, badges and the 15-second check (website loadDash()). */
export const useDash = create<State>((set, get) => ({
  dash: null,
  unread: 0,
  tick: 0,
  prevPending: null,
  alert: { id: 0, count: 0 },

  load: async () => {
    let d: Dashboard;
    try {
      d = await riderApi.dashboard();
    } catch (e) {
      // approval was taken away (rejected / suspended): the gate moves the rider to the status page
      if (e instanceof ApiError && (e.code === 'not_approved' || e.code === 'suspended')) void useAuth.getState().refreshMe();
      throw e;
    }
    if (!useAuth.getState().token) return d;
    if (d.rider) useAuth.getState().setRider(d.rider);
    const prev = get().prevPending;
    const more = prev !== null && d.pending > prev ? d.pending - prev : 0;
    set((s) => ({
      dash: d,
      unread: d.unread,
      prevPending: d.pending,
      tick: s.tick + 1,
      alert: more ? { id: s.alert.id + 1, count: more } : s.alert,
    }));
    if (more) playNewOrder();
    return d;
  },

  setUnread: (n) => set({ unread: n }),

  reset: () => set({ dash: null, unread: 0, prevPending: null }),
}));

// a different rider on this phone must never see the previous rider's numbers
useAuth.subscribe((s, p) => {
  if (s.token !== p.token) useDash.getState().reset();
});
