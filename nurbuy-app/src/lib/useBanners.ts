import { useMemo } from 'react';

import { useCatalog } from '@/store/catalog';

import { bannersFor, toBs, type BsBanner, type BsData, type Placement } from './banners';
import { useNow } from './useNow';

/** Live Banner Studio banners for a spot; re-checked every 20 seconds so schedules start and end on their own. */
export function useBanners(placements: Placement[]): { list: BsBanner[]; bs: BsData } {
  const raw = useCatalog((s) => s.catalog?.bs);
  const skew = useCatalog((s) => s.skew);
  const now = useNow(20000);
  const bs = useMemo(() => toBs(raw), [raw]);
  const list = bannersFor(bs, placements, Math.floor((now + skew) / 1000));
  return { list, bs };
}
