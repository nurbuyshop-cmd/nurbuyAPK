import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { fetchCatalog, fetchReviewSummary, toCatalog, type Catalog, type ReviewSummary } from '@/api/catalog';
import { isObj, num } from '@/lib/guards';

const CACHE_KEY = 'nb_cat';

type State = {
  catalog: Catalog | null;
  /** product id -> [avg, count] */
  ratings: ReviewSummary;
  /** the last network refresh failed and nothing is cached */
  error: boolean;
  /** server clock minus phone clock (ms), from the catalog's Banner Studio "now" */
  skew: number;
  /** reads the saved copy; resolves true when one was applied */
  loadCached: () => Promise<boolean>;
  refresh: () => Promise<void>;
  refreshRatings: () => Promise<void>;
};

export const useCatalog = create<State>((set, get) => ({
  catalog: null,
  ratings: {},
  error: false,
  skew: 0,

  loadCached: async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      const doc = raw ? toCatalog(JSON.parse(raw)) : null;
      if (doc && !get().catalog) set({ catalog: doc });
      return !!doc;
    } catch {
      return false;
    }
  },

  refresh: async () => {
    try {
      // the signature changes whenever anything in the catalog changes: skip converting and re-rendering otherwise
      const { doc, raw } = await fetchCatalog(get().catalog?.updated);
      const now = isObj(raw) && isObj(raw.bs) ? num(raw.bs.now) : 0;
      if (now > 0 && Math.abs(now - Date.now() - get().skew) > 2000) set({ skew: now - Date.now() });
      if (!doc || (doc.updated && doc.updated === get().catalog?.updated)) return;
      set({ catalog: doc, error: false });
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(raw)).catch(() => {});
    } catch {
      if (!get().catalog) set({ error: true });
    }
  },

  refreshRatings: async () => {
    try {
      const ratings = await fetchReviewSummary();
      if (JSON.stringify(ratings) !== JSON.stringify(get().ratings)) set({ ratings });
    } catch {
      // stars simply stay as they are
    }
  },
}));
