import { isObj, num, str, strOrNull } from '@/lib/guards';

import { api } from './api';

export type Notif = { id: number; title: string; body: string; url: string | null; img: string | null; kind: string; read: boolean; at: number };

export async function fetchNotifs(): Promise<{ list: Notif[]; unread: number }> {
  const r = await api('GET', '/me/notifications');
  const o = isObj(r) ? r : {};
  return {
    list: Array.isArray(o.notifications)
      ? o.notifications.filter(isObj).map((n) => ({
          id: num(n.id),
          title: str(n.title),
          body: str(n.body),
          url: strOrNull(n.url),
          img: strOrNull(n.img),
          kind: str(n.kind),
          read: n.read === true,
          at: num(n.at),
        }))
      : [],
    unread: num(o.unread),
  };
}

/** Marks the given notifications read, or all of them without ids. */
export async function markNotifsRead(ids?: number[]): Promise<void> {
  await api('POST', '/me/notifications/read', { body: ids ? { ids } : {} });
}

/** Registers this phone's push token for the signed-in customer (server add-on, see server/app-ext-addon). */
export async function registerDevice(token: string, platform: 'android' | 'ios'): Promise<void> {
  await api('POST', '/me/device', { body: { token, platform } });
}

export async function unregisterDevice(token: string): Promise<void> {
  await api('DELETE', '/me/device', { body: { token } });
}
