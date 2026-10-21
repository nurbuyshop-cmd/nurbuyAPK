import { PixelRatio, useWindowDimensions } from 'react-native';

import { useCatalog } from '@/store/catalog';
import { liteOn, useLite } from '@/store/lite';
import { useLocation } from '@/store/location';

import { indexCatalog, type CatalogIndex } from './products';

/** Derived catalog lists for the current catalog and chosen place (shops that do not deliver there are left out). */
export function useIndex(): CatalogIndex | null {
  const c = useCatalog((s) => s.catalog);
  const sel = useLocation((s) => s.sel);
  return c ? indexCatalog(c, sel) : null;
}

/** Card sizes for the phone: home rows show cards at 42% of the screen, grids have 2 columns. */
export function useCardSizes() {
  const { width } = useWindowDimensions();
  const lite = useLite(liteOn);
  const pad = 14;
  const gap = 12;
  const row = Math.round(Math.min(230, width * 0.42));
  // screen-sized photos like the website: at most 480 px on phones, 320 px in lite mode (the server keeps cached copies)
  const px = (w: number) => Math.min(lite ? 320 : 480, Math.round(w * PixelRatio.get()));
  return { pad, gap, row, rowImg: px(row), gridImg: px(Math.floor((width - pad * 2 - gap) / 2)) };
}
