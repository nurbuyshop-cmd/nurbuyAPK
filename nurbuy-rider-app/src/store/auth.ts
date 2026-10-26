import { create } from 'zustand';

import { configureApi } from '@/api/api';
import * as riderApi from '@/api/rider';
import { isRider, type Rider } from '@/api/rider';
import { unregisterPush } from '@/lib/push';
import { local, secure } from '@/lib/storage';

const TOKEN_KEY = 'nbr_tok';
const RIDER_KEY = 'nbr_rider';

type State = {
  /** 'boot' until the saved login has been read. */
  status: 'boot' | 'guest' | 'rider';
  token: string | null;
  rider: Rider | null;
  /** true while a new application uploads its documents (the status page waits until it is done) */
  applying: boolean;
  /** the application was sent in this session: the status page says so */
  justApplied: boolean;
  /** the login has expired: the login page says so once */
  expired: boolean;
  hydrate: () => Promise<void>;
  login: (id: string, password: string) => Promise<Rider>;
  /** Starts a session for a new application (documents are uploaded next). */
  startApplication: (token: string, rider: Rider) => Promise<void>;
  finishApplication: () => void;
  setRider: (r: Rider) => void;
  /** Reads the account again; returns it (or null when offline). */
  refreshMe: () => Promise<Rider | null>;
  logout: () => Promise<void>;
  /** Forgets the login on this phone without calling the server. */
  clearSession: () => Promise<void>;
};

export const useAuth = create<State>((set, get) => ({
  status: 'boot',
  token: null,
  rider: null,
  applying: false,
  justApplied: false,
  expired: false,

  hydrate: async () => {
    const token = await secure.get(TOKEN_KEY);
    if (!token) {
      set({ status: 'guest' });
      return;
    }
    // show the saved account at once, then confirm it with the server
    const cached = await local.get(RIDER_KEY, isRider);
    set({ status: cached ? 'rider' : 'boot', token, rider: cached });
    const fresh = await get().refreshMe();
    if (!fresh && !get().rider && get().token) {
      // first start offline without a saved account: still let the app open; pages show their own errors
      set({ status: 'rider' });
    }
  },

  login: async (id, password) => {
    const r = await riderApi.login(id, password);
    set({ status: 'rider', token: r.token, rider: r.rider, expired: false, justApplied: false });
    await secure.set(TOKEN_KEY, r.token);
    await local.set(RIDER_KEY, r.rider);
    return r.rider;
  },

  startApplication: async (token, rider) => {
    set({ status: 'rider', token, rider, applying: true, justApplied: true, expired: false });
    await secure.set(TOKEN_KEY, token);
    await local.set(RIDER_KEY, rider);
  },

  finishApplication: () => set({ applying: false }),

  setRider: (rider) => {
    set({ rider });
    void local.set(RIDER_KEY, rider);
  },

  refreshMe: async () => {
    if (!get().token) return null;
    try {
      const r = await riderApi.me();
      if (!get().token) return null;
      set({ rider: r, status: 'rider' });
      await local.set(RIDER_KEY, r);
      return r;
    } catch {
      // offline: keep the saved account; an expired login is cleared by the API hook
      return null;
    }
  },

  logout: async () => {
    // this phone stops getting the rider's notifications (needs the login, so before the server logout)
    await unregisterPush();
    try {
      await riderApi.logout();
    } catch {
      // the session is dropped on this phone either way
    }
    await get().clearSession();
  },

  clearSession: async () => {
    set({ status: 'guest', token: null, rider: null, applying: false, justApplied: false });
    await secure.remove(TOKEN_KEY);
    await local.remove(RIDER_KEY);
  },
}));

configureApi({
  token: () => useAuth.getState().token,
  onExpired: () => {
    if (!useAuth.getState().token) return;
    useAuth.setState({ expired: true });
    void useAuth.getState().clearSession();
  },
});
