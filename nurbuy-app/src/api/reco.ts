import { isObj, str } from '@/lib/guards';

import { api } from './api';

/** The last two product ids this customer (or this visitor) opened, from any device. Empty without tracking consent. */
export async function fetchRecentViews(visitor: string): Promise<string[]> {
  const r = await api('GET', `/reco/recent?v=${encodeURIComponent(visitor)}`);
  if (!isObj(r) || !Array.isArray(r.recent)) return [];
  return r.recent.filter(isObj).map((x) => str(x.id)).filter(Boolean);
}
