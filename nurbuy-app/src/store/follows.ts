import { create } from 'zustand';

import { fetchFollows, setFollow } from '@/api/account';

import { useAuth } from './auth';
import { useCatalog } from './catalog';
import { requireLogin } from './loginGate';

type State = {
  /** shop ids the signed-in customer follows */
  ids: string[];
  /** live follower counts after a tap (the catalog count can be up to a minute old) */
  counts: Record<string, number>;
  load: () => Promise<void>;
  toggle: (storeId: string) => void;
};

export const useFollows = create<State>((set, get) => ({
  ids: [],
  counts: {},
  load: async () => {
    try {
      set({ ids: await fetchFollows() });
    } catch {
      // the heart simply shows "Follow" until the next load
    }
  },
  toggle: (storeId) =>
    requireLogin(() => {
      const on = !get().ids.includes(storeId);
      // update at once, then confirm with the server
      set({ ids: on ? [storeId, ...get().ids] : get().ids.filter((x) => x !== storeId) });
      setFollow(storeId, on)
        .then((r) => set({ counts: { ...get().counts, [storeId]: r.count } }))
        .catch(() => set({ ids: on ? get().ids.filter((x) => x !== storeId) : [storeId, ...get().ids] }));
    }),
}));

// the follow list belongs to the signed-in customer
useAuth.subscribe((s, prev) => {
  if (s.status === prev.status) return;
  if (s.status === 'user') void useFollows.getState().load();
  else useFollows.setState({ ids: [], counts: {} });
});

// fresh catalog counts replace the remembered ones
useCatalog.subscribe((s, prev) => {
  if (s.catalog !== prev.catalog) useFollows.setState({ counts: {} });
});
