import * as Crypto from 'expo-crypto';

import { secure } from './storage';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const VID_KEY = 'nb_vid';

/** Random [A-Za-z0-9] id, the format the analytics endpoint accepts (8 to 40 chars). */
function randomId(len: number): string {
  const bytes = Crypto.getRandomBytes(len);
  let s = '';
  for (const b of bytes) s += ALPHA.charAt(b % ALPHA.length);
  return s;
}

/** One id per app launch. */
export const sessionId = randomId(20);

let vid: string | null = null;

/** Anonymous visitor id, created once and kept in secure storage. */
export async function visitorId(): Promise<string> {
  if (vid) return vid;
  const saved = await secure.get(VID_KEY);
  if (saved && /^[A-Za-z0-9]{8,40}$/.test(saved)) {
    vid = saved;
    return saved;
  }
  vid = randomId(24);
  await secure.set(VID_KEY, vid);
  return vid;
}
