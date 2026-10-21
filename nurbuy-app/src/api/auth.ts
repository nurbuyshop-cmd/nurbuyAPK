import { isObj, num, str, type Obj } from '@/lib/guards';

import { api } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  /** mobile verified */
  mvf: boolean;
  hasPw: boolean;
  created_at: number;
};

export type Me = { user: User; profile: Obj; walletBal: number };

export function toUser(v: unknown): User | null {
  if (!isObj(v) || typeof v.id !== 'string') return null;
  return {
    id: v.id,
    name: str(v.name),
    email: str(v.email),
    mobile: str(v.mobile),
    mvf: num(v.mvf) === 1,
    hasPw: v.hasPw === true,
    created_at: num(v.created_at),
  };
}

function toSession(v: unknown): { token: string; user: User } {
  const user = isObj(v) ? toUser(v.user) : null;
  if (!isObj(v) || typeof v.token !== 'string' || !user) throw new Error('Unexpected server answer');
  return { token: v.token, user };
}

export async function login(id: string, password: string) {
  return toSession(await api('POST', '/auth/login', { body: { id, password } }));
}

export async function signup(p: { name: string; mobile: string; email: string; password: string }) {
  return toSession(await api('POST', '/auth/signup', { body: p }));
}

export async function logout(): Promise<void> {
  await api('POST', '/auth/logout');
}

export async function me(): Promise<Me> {
  const r = await api('GET', '/auth/me');
  const user = isObj(r) ? toUser(r.user) : null;
  if (!isObj(r) || !user) throw new Error('Unexpected server answer');
  return {
    user,
    profile: isObj(r.profile) ? r.profile : {},
    walletBal: isObj(r.wallet) ? num(r.wallet.bal) : 0,
  };
}
