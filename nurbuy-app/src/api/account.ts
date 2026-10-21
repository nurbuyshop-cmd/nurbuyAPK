import { isObj, isStr, num, str } from '@/lib/guards';

import { api } from './api';
import { toUser, type User } from './auth';

export type WalletTx = { t: string; a: number; oid: string; pct: number | null; d: number };
export type Wallet = { bal: number; pct: number; card: string; tx: WalletTx[] };

export async function fetchWallet(): Promise<Wallet> {
  const r = await api('GET', '/wallet');
  const o = isObj(r) ? r : {};
  return {
    bal: num(o.bal),
    pct: num(o.pct),
    card: str(o.card),
    tx: Array.isArray(o.tx)
      ? o.tx.filter(isObj).map((x) => ({ t: str(x.t), a: num(x.a), oid: str(x.oid), pct: x.pct == null ? null : num(x.pct), d: num(x.d) }))
      : [],
  };
}

/** PUT /me: name, email and mobile (a new mobile becomes unverified). */
export async function updateMe(p: { name?: string; email?: string; mobile?: string }): Promise<User> {
  const r = await api('PUT', '/me', { body: p });
  const u = isObj(r) ? toUser(r.user) : null;
  if (!u) throw new Error('Unexpected server answer');
  return u;
}

export async function changePassword(password: string, current: string): Promise<void> {
  await api('POST', '/me/password', { body: current ? { password, current } : { password } });
}

/** Uploads the profile photo or the cover photo (jpeg); the server stores it in the profile and returns its address. */
export async function uploadProfilePhoto(kind: 'avatar' | 'cover', uri: string): Promise<string> {
  const form = new FormData();
  // React Native sends { uri, name, type } objects as files
  form.append('file', { uri, name: `${kind}.jpg`, type: 'image/jpeg' } as unknown as Blob);
  const r = await api('POST', `/me/${kind}`, { form, timeoutMs: 60000 });
  const url = isObj(r) ? str(r.url) : '';
  if (!/^https:\/\//.test(url)) throw new Error('Unexpected server answer');
  return url;
}

/** Shop ids the customer follows. */
export async function fetchFollows(): Promise<string[]> {
  const r = await api('GET', '/follows');
  return isObj(r) && Array.isArray(r.stores) ? r.stores.filter(isStr) : [];
}

export async function setFollow(store: string, on: boolean): Promise<{ on: boolean; count: number }> {
  const r = await api('POST', `/follows/${encodeURIComponent(store)}`, { body: { on } });
  return { on: isObj(r) ? r.on === true : on, count: isObj(r) ? num(r.count) : 0 };
}
