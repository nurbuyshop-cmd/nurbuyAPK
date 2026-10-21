import { useEffect, useMemo } from 'react';

import { fetchRecentViews } from '@/api/reco';
import type { Product } from '@/api/catalog';
import { useAuth } from '@/store/auth';
import { trackingAllowed, useConsent } from '@/store/consent';
import { useHistory } from '@/store/history';

import { useIndex } from './useIndex';
import { visitorId } from './visitor';

/**
 * The last two products the customer opened, for suggestions. Only with tracking consent (like the website).
 * A signed-in customer on a new phone gets them from the server (/reco/recent), so suggestions work on any device.
 */
export function useRecent(): Product[] {
  const idx = useIndex();
  const allowed = useConsent(trackingAllowed);
  const status = useAuth((s) => s.status);
  const local = useHistory((s) => s.ids);
  const remote = useHistory((s) => s.remote);

  useEffect(() => {
    if (!allowed || status !== 'user' || local.length) return;
    let live = true;
    visitorId()
      .then(fetchRecentViews)
      .then((ids) => live && useHistory.getState().setRemote(ids))
      .catch(() => {
        // suggestions simply stay popularity-based
      });
    return () => {
      live = false;
    };
  }, [allowed, status, local.length]);

  return useMemo(() => {
    if (!idx || !allowed) return [];
    const ids = local.length ? local : remote;
    return ids.map((id) => idx.byId.get(id)).filter((p): p is Product => !!p).slice(0, 2);
  }, [idx, allowed, local, remote]);
}
