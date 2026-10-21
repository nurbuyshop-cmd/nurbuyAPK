import { isObj, num, str } from '@/lib/guards';

import { api } from './api';

/** Customer care details and privacy switches from GET /access/info. */
export type AccessInfo = {
  phone: string;
  hours: string;
  title: string;
  message: string;
  message_bn: string;
  appeal: number;
  appeal_note: string;
  consent_required: number;
  personalization: number;
};

export function toAccessInfo(v: unknown): AccessInfo | null {
  if (!isObj(v)) return null;
  return {
    phone: str(v.phone),
    hours: str(v.hours),
    title: str(v.title),
    message: str(v.message),
    message_bn: str(v.message_bn),
    appeal: num(v.appeal),
    appeal_note: str(v.appeal_note),
    consent_required: num(v.consent_required),
    personalization: num(v.personalization),
  };
}

export async function accessInfo(): Promise<AccessInfo> {
  const r = toAccessInfo(await api('GET', '/access/info'));
  if (!r) throw new Error('Unexpected server answer');
  return r;
}

export async function sendAppeal(p: { name: string; mobile: string; message: string }): Promise<string> {
  const r = await api('POST', '/appeals', { body: p });
  return isObj(r) ? str(r.ref) : '';
}

export type AppealStatus = { status: 'open' | 'approved' | 'rejected'; reply: string };

export async function appealStatus(ref: string, mobile: string): Promise<AppealStatus> {
  const r = await api('GET', `/appeals/status?ref=${encodeURIComponent(ref)}&mobile=${encodeURIComponent(mobile)}`);
  const s = isObj(r) ? str(r.status) : '';
  return {
    status: s === 'open' || s === 'approved' ? s : 'rejected',
    reply: isObj(r) ? str(r.reply) : '',
  };
}

/** Erases the stored activity of this visitor (and of the signed-in customer). */
export async function forgetMe(visitor: string): Promise<void> {
  await api('POST', '/privacy/forget', { body: { v: visitor } });
}
