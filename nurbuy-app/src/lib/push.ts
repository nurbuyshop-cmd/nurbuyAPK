import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { registerDevice, unregisterDevice } from '@/api/notifications';

import { isObj, isStr } from './guards';
import { secure } from './storage';

const TOKEN_KEY = 'nb_push_tok';

type Mod = typeof import('expo-notifications');

let mod: Mod | null | undefined;

/**
 * Loads expo-notifications only when it is needed. Expo Go does not contain its native part, so importing it at the top of
 * the app would stop the whole app there; in the real app it loads normally. Returns null when it cannot be used.
 */
async function notifications(): Promise<Mod | null> {
  if (mod !== undefined) return mod;
  // Expo Go: not even loaded (loading it there logs a red "Cannot find native module" error)
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    mod = null;
    return mod;
  }
  try {
    const m: Mod = await import('expo-notifications');
    // a notification that arrives while the app is open is still shown as a banner
    m.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    mod = m;
  } catch {
    mod = null;
  }
  return mod;
}

/** Asks for the notification permission only (first-start permission screen); the phone is registered after login. */
export async function askNotificationPermission(): Promise<void> {
  try {
    const N = await notifications();
    if (!N) return;
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('default', { name: 'NurBuy', importance: N.AndroidImportance.HIGH });
    }
    await N.requestPermissionsAsync();
  } catch {
    // not available in this build
  }
}

/**
 * After login: asks for permission, gets this phone's Firebase (FCM) token and registers it with POST /me/device.
 * Quietly does nothing when the phone, Expo Go or the server cannot do phone push yet.
 */
export async function registerPush(): Promise<void> {
  try {
    const N = await notifications();
    if (!N) return;
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('default', { name: 'NurBuy', importance: N.AndroidImportance.HIGH });
    }
    const perm = await N.requestPermissionsAsync();
    if (!perm.granted) return;
    // Firebase may hand out a new token later: send that one too
    if (!tokenWatch) {
      tokenWatch = N.addPushTokenListener((t) => {
        if (isStr(t.data) && t.data) void sendToken(t.data);
      });
    }
    const tok = await N.getDevicePushTokenAsync();
    if (!isStr(tok.data) || !tok.data) return;
    await sendToken(tok.data);
  } catch {
    // no Firebase set-up in this build, or the server does not have /me/device yet
  }
}

let tokenWatch: { remove: () => void } | null = null;

async function sendToken(token: string) {
  await registerDevice(token, Platform.OS === 'ios' ? 'ios' : 'android');
  await secure.set(TOKEN_KEY, token);
}

/** Before logout: this phone stops receiving the customer's notifications. */
export async function unregisterPush(): Promise<void> {
  const tok = await secure.get(TOKEN_KEY);
  if (!tok) return;
  try {
    await unregisterDevice(tok);
  } catch {
    // the server forgets unknown tokens by itself when Google reports them
  }
  await secure.remove(TOKEN_KEY);
}

/** The link a tapped notification carries (relative website path, e.g. /orders/NBM-1). */
function linkOf(r: { notification: { request: { content: { data?: unknown } } } } | null): string | null {
  const d = r?.notification.request.content.data;
  return isObj(d) && isStr(d.url) && d.url ? d.url : null;
}

/**
 * Opens a tapped notification's link: also when the tap started the app. Returns a function that stops listening.
 * Does nothing (returns a no-op) where notifications are not available.
 */
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
