import { API_BASE } from '@/config';
import { isObj, num, numOrNull, str, strOrNull } from '@/lib/guards';

/** Restriction details the server attaches to a 403 "blocked" answer (and /access/info). */
export type BlockInfo = {
  ref: string | null;
  kind: string;
  expires: number | null;
  title: string;
  message: string;
  message_bn: string;
  phone: string;
  hours: string;
  appeal: number;
  appeal_note: string;
};

export function toBlock(v: unknown): BlockInfo {
  const o = isObj(v) ? v : {};
  return {
    ref: strOrNull(o.ref),
    kind: str(o.kind, 'user'),
    expires: numOrNull(o.expires),
    title: str(o.title),
    message: str(o.message),
    message_bn: str(o.message_bn),
    phone: str(o.phone),
    hours: str(o.hours),
    appeal: num(o.appeal),
    appeal_note: str(o.appeal_note),
  };
}

/** Every failed call becomes one of these. status 0 means the server could not be reached. */
export class ApiError extends Error {
  readonly status: number;
  readonly error: string;
  readonly field?: string;
  readonly code?: string;
  readonly block?: BlockInfo;
  readonly data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    const error = str(data.error, status === 0 ? 'network' : 'Error');
    super(error);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.data = data;
    if (typeof data.field === 'string') this.field = data.field;
    if (typeof data.code === 'string') this.code = data.code;
    if (data.code === 'blocked') this.block = toBlock(data.block);
  }
}

type Hooks = {
  token: () => string | null;
  /** The saved login is no longer valid. */
  onExpired: () => void;
  /** The server restricted this customer or IP. */
  onBlocked: (b: BlockInfo) => void;
};

let hooks: Hooks = { token: () => null, onExpired: () => {}, onBlocked: () => {} };

/** Wired once by the auth store so this module stays free of UI and state imports. */
export function configureApi(h: Hooks) {
  hooks = h;
}

type Opts = { body?: unknown; form?: FormData; timeoutMs?: number; signal?: AbortSignal };

/**
 * Calls the NurBuy API and returns the parsed JSON (unknown: callers validate it).
 * gzip is handled by the platform. A 401 on a saved login (except login itself and order placement,
 * which answer login_required) signs out; a "blocked" 403 opens the restricted screen.
 */
export async function api(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, opts: Opts = {}): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const tok = hooks.token();
  if (tok) headers.Authorization = `Bearer ${tok}`;
  let body: string | FormData | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  let status: number;
  let text: string;
  if (body instanceof FormData) {
    ({ status, text } = await sendForm(method, API_BASE + path, headers, body, opts.timeoutMs ?? 60000));
  } else {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 20000);
    const onAbort = () => ctrl.abort();
    opts.signal?.addEventListener('abort', onAbort);
    try {
      const res = await fetch(API_BASE + path, { method, headers, body, signal: ctrl.signal });
      status = res.status;
      text = await res.text().catch(() => '');
    } catch {
      throw new ApiError(0, {});
    } finally {
      clearTimeout(timer);
      opts.signal?.removeEventListener('abort', onAbort);
    }
  }

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (status >= 200 && status < 300) return data;

  const err = new ApiError(status, isObj(data) ? data : {});
  if (err.block) hooks.onBlocked(err.block);
  else if (status === 401 && tok && !path.startsWith('/auth/login') && !path.startsWith('/orders')) hooks.onExpired();
  throw err;
}

/**
 * File uploads go through React Native's XMLHttpRequest: Expo's own fetch (installed globally since SDK 52+) cannot send
 * React Native's { uri, name, type } file parts and fails before anything reaches the server.
 */
function sendForm(method: string, url: string, headers: Record<string, string>, form: FormData, timeoutMs: number): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.timeout = timeoutMs;
    xhr.onload = () => resolve({ status: xhr.status, text: typeof xhr.responseText === 'string' ? xhr.responseText : '' });
    xhr.onerror = () => reject(new ApiError(0, {}));
    xhr.ontimeout = () => reject(new ApiError(0, {}));
    xhr.send(form);
  });
}
