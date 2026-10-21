import { create } from 'zustand';

import { configureApi } from '@/api/api';
import * as authApi from '@/api/auth';
import type { User } from '@/api/auth';
import { isObj, type Obj } from '@/lib/guards';
import { local, secure } from '@/lib/storage';

import { useBlock } from './block';

const TOKEN_KEY = 'nb_tok';
const USER_KEY = 'nb_user';

type Cached = { user: User; profile: Obj };
const isCached = (v: unknown): v is Cached => isObj(v) && isObj(v.user) && typeof v.user.id === 'string' && isObj(v.profile);

type State = {
  /** 'boot' until the saved login has been read. */
  status: 'boot' | 'guest' | 'user';
  token: string | null;
  user: User | null;
  profile: Obj;
  walletBal: number;
  hydrate: () => Promise<void>;
  login: (id: string, password: string) => Promise<User>;
  signup: (p: { name: string; mobile: string; email: string; password: string }) => Promise<User>;
  refreshMe: () => Promise<void>;
  /** Changes the profile here and in the saved copy, so the change still shows on the next app start. */
  setProfile: (profile: Obj) => void;
  logout: () => Promise<void>;
  /** Forgets the login on this phone without calling the server. */
  clearSession: () => Promise<void>;
};

export const useAuth = create<State>((set, get) => ({
  status: 'boot',
  token: null,
  user: null,
  profile: {},
  walletBal: 0,

  hydrate: async () => {
    const token = await secure.get(TOKEN_KEY);
    if (!token) {
      set({ status: 'guest' });
      return;
    }
    // show the cached account at once, then confirm it with the server
    const cached = await local.get(USER_KEY, isCached);
    set({ status: 'user', token, user: cached?.user ?? null, profile: cached?.profile ?? {} });
    get().refreshMe().catch(() => {
      // offline: keep the cached account; an expired login is cleared by the API hook
    });
  },

  login: async (id, password) => {
    const s = await authApi.login(id, password);
    await startSession(s.token, s.user);
    return s.user;
  },

  signup: async (p) => {
    const s = await authApi.signup(p);
    await startSession(s.token, s.user);
    return s.user;
  },

  refreshMe: async () => {
    if (!get().token) return;
    const m = await authApi.me();
    set({ user: m.user, profile: m.profile, walletBal: m.walletBal, status: 'user' });
    await local.set(USER_KEY, { user: m.user, profile: m.profile });
  },

  setProfile: (profile) => {
    set({ profile });
    const user = get().user;
    if (user) void local.set(USER_KEY, { user, profile });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // the session is dropped on this phone either way
    }
    await get().clearSession();
  },

  clearSession: async () => {
    set({ status: 'guest', token: null, user: null, profile: {}, walletBal: 0 });
    await secure.remove(TOKEN_KEY);
    await local.remove(USER_KEY);
  },
}));

async function startSession(token: string, user: User) {
  useAuth.setState({ status: 'user', token, user, profile: {} });
  await secure.set(TOKEN_KEY, token);
  await useAuth.getState().refreshMe().catch(() => {});
}

configureApi({
  token: () => useAuth.getState().token,
  onExpired: () => {
    void useAuth.getState().clearSession();
  },
  onBlocked: (b) => {
    // a restricted customer loses the saved login on this phone, like on the website
    if (useAuth.getState().token) void useAuth.getState().clearSession();
    useBlock.getState().setBlock(b);
  },
});
