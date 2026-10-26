/** Small type guards used to validate JSON at the API boundary. */
export type Obj = Record<string, unknown>;

export const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
export const isStr = (v: unknown): v is string => typeof v === 'string';
export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export const str = (v: unknown, d = ''): string => (isStr(v) ? v : isNum(v) ? String(v) : d);
export const num = (v: unknown, d = 0): number => {
  if (isNum(v)) return v;
  if (isStr(v) && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return d;
};
export const strOrNull = (v: unknown): string | null => (isStr(v) && v !== '' ? v : null);
export const numOrNull = (v: unknown): number | null => (v === null || v === undefined ? null : isNum(v) ? v : null);
