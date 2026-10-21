import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { api } from '@/api/api';

import { isObj, isStr } from './guards';
import { secure } from './storage';

const TOKEN_KEY = 'nbs_push_tok';
/** Android notification channel; its sound is the new-order chime (assets/new_order.wav, added by the expo-notifications plugin). */
const CHANNEL = 'default';

type Mod = typeof import('expo-notifications');

let mod: Mod | null | undefined;

/**
 * Loads expo-notifications only when it is needed. Expo Go does not contain its native part, so importing it at the top of
 * the app would stop the whole app there; in the real app it loads normally. Returns null when it cannot be used.
 */
async function notifications(): Promise<Mod | null> {
  if (mod !== undefined) return mod;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    mod = null;
    return mod;
  }
  try {
    const m: Mod = await import('expo-notifications');
    // while the app is open the 20-second check already rings; the banner still shows
    m.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    mod = m;
  } catch {
    mod = null;
  }
  return mod;
}

async function channel(N: Mod) {
  if (Platform.OS !== 'android') return;
  await N.setNotificationChannelAsync(CHANNEL, {
    name: 'NurBuy Seller',
    importance: N.AndroidImportance.MAX,
    sound: 'new_order.wav',
    vibrationPattern: [0, 300, 200, 300],
    lockscreenVisibility: N.AndroidNotificationVisibility.PUBLIC,
  });
}

let tokenWatch: { remove: () => void } | null = null;

async function sendToken(token: string) {
  await api('POST', '/seller/device', { body: { token, platform: Platform.OS === 'ios' ? 'ios' : 'android' } });
  await secure.set(TOKEN_KEY, token);
}

/**
 * After login: asks for permission, gets this phone's Firebase (FCM) token and registers it with POST /seller/device
 * (server add-on v2). Quietly does nothing when the phone, Expo Go, Firebase or the server cannot do phone push yet.
 */
export async function registerPush(): Promise<void> {
  try {
    const N = await notifications();
    if (!N) return;
    await channel(N);
    const perm = await N.requestPermissionsAsync();
    if (!perm.granted) return;
    if (!tokenWatch) {
      tokenWatch = N.addPushTokenListener((t) => {
        if (isStr(t.data) && t.data) void sendToken(t.data).catch(() => {});
      });
    }
    const tok = await N.getDevicePushTokenAsync();
    if (!isStr(tok.data) || !tok.data) return;
    await sendToken(tok.data);
  } catch {
    // no Firebase set-up in this build, or the server add-on is not updated yet
  }
}

/** Before logout: this phone stops receiving the shop's notifications. */
export async function unregisterPush(): Promise<void> {
  const tok = await secure.get(TOKEN_KEY);
  if (!tok) return;
  try {
    await api('DELETE', '/seller/device', { body: { token: tok } });
  } catch {
    // the server forgets unknown tokens by itself when Google reports them
  }
  await secure.remove(TOKEN_KEY);
}

function linkOf(r: { notification: { request: { content: { data?: unknown } } } } | null): string | null {
  const d = r?.notification.request.content.data;
  return isObj(d) && isStr(d.url) && d.url ? d.url : null;
}

/** Opens a tapped notification's link (also when the tap started the app). Returns a function that stops listening. */
export function listenNotificationTaps(go: (url: string) => void): () => void {
  let stop = false;
  let remove: (() => void) | null = null;
  void notifications().then((N) => {
    if (!N || stop) return;
    const first = linkOf(N.getLastNotificationResponse());
    N.clearLastNotificationResponse();
    if (first) go(first);
    const sub = N.addNotificationResponseReceivedListener((r) => {
      const url = linkOf(r);
      if (url) go(url);
    });
    remove = () => sub.remove();
  });
  return () => {
    stop = true;
    remove?.();
  };
}
