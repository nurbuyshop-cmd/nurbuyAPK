import { isObj, num, str, strOrNull } from '@/lib/guards';

import { api } from './api';

/** from: c = customer, a = support agent, b = bot, s = system. kind: t text, img, aud voice, ord order, prd product. */
export type ChatMsg = { id: number; conv: string; from: string; kind: string; text: string; url: string | null; dur: number | null; ts: number };

export type ChatConv = { id: string; status: string; mode: string; unread: number; lastAt: number };

function toMsg(v: unknown): ChatMsg | null {
  if (!isObj(v)) return null;
  return {
    id: num(v.id),
    conv: str(v.conv),
    from: str(v.from),
    kind: str(v.kind, 't'),
    text: str(v.text),
    url: strOrNull(v.url),
    dur: v.dur == null ? null : num(v.dur),
    ts: num(v.ts),
  };
}

function toConv(v: unknown): ChatConv | null {
  if (!isObj(v) || typeof v.id !== 'string') return null;
  return { id: v.id, status: str(v.status), mode: str(v.mode), unread: num(v.unread_user), lastAt: num(v.last_at) };
}

export async function chatSync(after: number): Promise<{ convs: ChatConv[]; msgs: ChatMsg[]; last: number }> {
  const r = await api('GET', `/chat/sync?after=${after}`);
  const o = isObj(r) ? r : {};
  return {
    convs: Array.isArray(o.convs) ? o.convs.map(toConv).filter((c): c is ChatConv => !!c) : [],
    msgs: Array.isArray(o.msgs) ? o.msgs.map(toMsg).filter((m): m is ChatMsg => !!m) : [],
    last: num(o.last, after),
  };
}

export type SendBody = { conv?: string; kind: 't' | 'img' | 'aud'; text?: string; url?: string; dur?: number };

/** Sends a customer message; without a conversation (or after the old one was resolved) the server opens a new one for an agent. */
export async function chatSend(b: SendBody): Promise<{ conv: ChatConv; msg: ChatMsg }> {
  const r = await api('POST', '/chat/send', { body: { ...b, from: 'c', mode: 'human', view: 'min' } });
  const conv = isObj(r) ? toConv(r.conv) : null;
  const msg = isObj(r) ? toMsg(r.msg) : null;
  if (!conv || !msg) throw new Error('Unexpected server answer');
  return { conv, msg };
}

export async function chatRead(conv: string): Promise<void> {
  await api('POST', '/chat/read', { body: { conv } });
}

/** Uploads a photo or voice recording and returns its address for chatSend. */
export async function chatUpload(uri: string, kind: 'img' | 'aud'): Promise<string> {
  const form = new FormData();
  form.append('kind', kind);
  const file = kind === 'img' ? { uri, name: 'photo.jpg', type: 'image/jpeg' } : { uri, name: 'voice.m4a', type: 'audio/mp4' };
  // React Native sends { uri, name, type } objects as files
  form.append('file', file as unknown as Blob);
  const r = await api('POST', '/chat/upload', { form, timeoutMs: 60000 });
  return isObj(r) ? str(r.url) : '';
}
