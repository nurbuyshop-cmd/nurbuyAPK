import { create } from 'zustand';

import { configureApi } from '@/api/api';
import * as sellerApi from '@/api/seller';
import { isSeller, type Seller } from '@/api/seller';
import { unregisterPush } from '@/lib/push';
import { local, secure } from '@/lib/storage';

const TOKEN_KEY = 'nbs_tok';
const SELLER_KEY = 'nbs_seller';

type State = {
  /** 'boot' until the saved login has been read. */
  status: 'boot' | 'guest' | 'seller';
  token: string | null;
  seller: Seller | null;
  /** true while a new application uploads its documents (the status page waits until it is done) */
  applying: boolean;
  /** the application was sent in this session: the status page thanks the seller */
  justApplied: boolean;
  /** the login has expired: the login page says so once */
  expired: boolean;
  hydrate: () => Promise<void>;
  login: (id: string, password: string) => Promise<Seller>;
  /** Starts a session for a new application (documents are uploaded next). */
  startApplication: (token: string, seller: Seller) => Promise<void>;
  finishApplication: () => void;
  setSeller: (s: Seller) => void;
  /** Reads the account again; returns it (or null when offline). */
  refreshMe: () => Promise<Seller | null>;
  logout: () => Promise<void>;
  /** Forgets the login on this phone without calling the server. */
  clearSession: () => Promise<void>;
};

export const useAuth = create<State>((set, get) => ({
  status: 'boot',
  token: null,
  seller: null,
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
    const cached = await local.get(SELLER_KEY, isSeller);
    set({ status: cached ? 'seller' : 'boot', token, seller: cached });
    const fresh = await get().refreshMe();
    if (!fresh && !get().seller && get().token) {
      // first start offline without a saved account: still let the app open; pages show their own errors
      set({ status: 'seller' });
    }
  },

  login: async (id, password) => {
    const s = await sellerApi.login(id, password);
    set({ status: 'seller', token: s.token, seller: s.seller, expired: false, justApplied: false });
    await secure.set(TOKEN_KEY, s.token);
    await local.set(SELLER_KEY, s.seller);
    return s.seller;
  },

  startApplication: async (token, seller) => {
    set({ status: 'seller', token, seller, applying: true, justApplied: true, expired: false });
    await secure.set(TOKEN_KEY, token);
    await local.set(SELLER_KEY, seller);
  },

  finishApplication: () => set({ applying: false }),

  setSeller: (seller) => {
    set({ seller });
    void local.set(SELLER_KEY, seller);
  },

  refreshMe: async () => {
    if (!get().token) return null;
    try {
      const s = await sellerApi.me();
      if (!get().token) return null;
      set({ seller: s, status: 'seller' });
      await local.set(SELLER_KEY, s);
      return s;
    } catch {
      // offline: keep the saved account; an expired login is cleared by the API hook
      return null;
    }
  },

  logout: async () => {
    // this phone stops getting the shop's notifications (needs the login, so before the server logout)
    await unregisterPush();
    try {
      await sellerApi.logout();
    } catch {
      // the session is dropped on this phone either way
    }
    await get().clearSession();
  },

  clearSession: async () => {
    set({ status: 'guest', token: null, seller: null, applying: false, justApplied: false });
    await secure.remove(TOKEN_KEY);
    await local.remove(SELLER_KEY);
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
