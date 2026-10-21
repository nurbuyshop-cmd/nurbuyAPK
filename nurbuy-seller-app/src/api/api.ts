import { API_BASE } from '@/config';
import { isObj, str } from '@/lib/guards';

/** Every failed call becomes one of these. status 0 means the server could not be reached. */
export class ApiError extends Error {
  readonly status: number;
  readonly error: string;
  readonly field?: string;
  readonly code?: string;
  readonly data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    const error = str(data.error, status === 0 ? 'network' : '');
    super(error || `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.data = data;
    if (typeof data.field === 'string' && data.field) this.field = data.field;
    if (typeof data.code === 'string' && data.code) this.code = data.code;
  }
}

type Hooks = {
  token: () => string | null;
  /** The saved login is no longer valid. */
  onExpired: () => void;
};

let hooks: Hooks = { token: () => null, onExpired: () => {} };

/** Wired once by the auth store so this module stays free of UI and state imports. */
export function configureApi(h: Hooks) {
  hooks = h;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Opts = { body?: unknown; form?: FormData; timeoutMs?: number; anon?: boolean; onProgress?: (p: number) => void };

/**
 * Calls the NurBuy API and returns the parsed JSON (unknown: callers validate it).
 * A 401 on a saved login (except the login call itself) signs the seller out, like the website.
 */
export async function api(method: Method, path: string, opts: Opts = {}): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const tok = opts.anon ? null : hooks.token();
  if (tok) headers.Authorization = `Bearer ${tok}`;

  let status: number;
  let text: string;
  if (opts.form) {
    ({ status, text } = await sendForm(method, API_BASE + path, headers, opts.form, opts.timeoutMs ?? 120000, opts.onProgress));
  } else {
    let body: string | undefined;
    if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(opts.body);
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 25000);
    try {
      const res = await fetch(API_BASE + path, { method, headers, body, signal: ctrl.signal });
      status = res.status;
      text = await res.text().catch(() => '');
    } catch {
      throw new ApiError(0, {});
    } finally {
      clearTimeout(timer);
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
  if (status >= 200 && status < 300 && data !== null) return data;

  const err = new ApiError(status, isObj(data) ? data : {});
  if (status === 401 && tok) hooks.onExpired();
  throw err;
}

/**
 * File uploads go through React Native's XMLHttpRequest: Expo's own fetch (installed globally since SDK 52+) cannot send
 * React Native's { uri, name, type } file parts and fails before anything reaches the server.
 */
function sendForm(
  method: string,
  url: string,
  headers: Record<string, string>,
  form: FormData,
  timeoutMs: number,
  onProgress?: (p: number) => void,
): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.timeout = timeoutMs;
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) onProgress(e.loaded / e.total);
      };
    }
    xhr.onload = () => resolve({ status: xhr.status, text: typeof xhr.responseText === 'string' ? xhr.responseText : '' });
    xhr.onerror = () => reject(new ApiError(0, {}));
    xhr.ontimeout = () => reject(new ApiError(0, {}));
    xhr.send(form);
  });
}

/** Downloads a private file with the login token and returns it as a data URL (documents are images or PDFs). */
export async function fetchPrivateFile(path: string): Promise<{ type: string; dataUrl: string }> {
  const tok = hooks.token();
  const res = await fetch(API_BASE + path, { headers: tok ? { Authorization: `Bearer ${tok}` } : {} }).catch(() => {
    throw new ApiError(0, {});
  });
  if (!res.ok) throw new ApiError(res.status, {});
  const type = res.headers.get('Content-Type') ?? 'application/octet-stream';
  const buf = await res.arrayBuffer();
  return { type, dataUrl: `data:${type};base64,${toBase64(new Uint8Array(buf))}` };
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64(b: Uint8Array): string {
  let out = '';
  let i = 0;
  for (; i + 2 < b.length; i += 3) {
    const n = ((b[i] ?? 0) << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0);
    out += B64.charAt(n >> 18) + B64.charAt((n >> 12) & 63) + B64.charAt((n >> 6) & 63) + B64.charAt(n & 63);
  }
  const rest = b.length - i;
  if (rest === 1) {
    const n = (b[i] ?? 0) << 16;
    out += `${B64.charAt(n >> 18)}${B64.charAt((n >> 12) & 63)}==`;
  } else if (rest === 2) {
    const n = ((b[i] ?? 0) << 16) | ((b[i + 1] ?? 0) << 8);
    out += `${B64.charAt(n >> 18)}${B64.charAt((n >> 12) & 63)}${B64.charAt((n >> 6) & 63)}=`;
  }
  return out;
}
