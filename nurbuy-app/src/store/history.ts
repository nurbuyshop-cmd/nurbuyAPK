import { create } from 'zustand';

import { isStr } from '@/lib/guards';
import { local } from '@/lib/storage';

const KEY = 'nb_hist';
const MAX = 60;
const isIds = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

type State = {
  /** product ids, most recent first */
  ids: string[];
  hydrate: () => Promise<void>;
  add: (id: string) => void;
  clear: () => void;
  /** product ids the server remembers from other devices; used for suggestions only, not shown as history */
  remote: string[];
  setRemote: (ids: string[]) => void;
};

/** "Your browsing history": products opened on this phone. */
export const useHistory = create<State>((set, get) => ({
  ids: [],
  remote: [],
  setRemote: (remote) => set({ remote }),
  hydrate: async () => {
    const ids = await local.get(KEY, isIds);
    if (ids) set({ ids });
  },
  add: (id) => {
    const ids = [id, ...get().ids.filter((x) => x !== id)].slice(0, MAX);
    set({ ids });
    void local.set(KEY, ids);
  },
  clear: () => {
    set({ ids: [] });
    void local.remove(KEY);
  },
}));
