import { useCatalog } from '@/store/catalog';
import { selectedPlaces, useLocation } from '@/store/location';

export type DeliveryInfo = {
  /** promised minutes */
  eta: number;
  /** delivery charge per shop below the free limit */
  fee: number;
  /** order value from which delivery is free; null = never free */
  freeAbove: number | null;
  /** zones mode: the pin decides; areas mode: district/thana/village decide */
  zonesMode: boolean;
};

/**
 * Delivery promise for the customer's chosen place, from the server only:
 * zones mode uses the pin's quote (else the zone defaults); areas mode uses the village's own charge and minutes
 * (else the defaults sent with the area list); the catalog settings are the last fallback.
 */
export function useDelivery(): DeliveryInfo {
  const s = useCatalog((x) => x.catalog?.settings);
  const areas = useLocation((x) => x.areas);
  const zones = useLocation((x) => x.zones);
  const sel = useLocation((x) => x.sel);
  const quote = useLocation((x) => x.quote);
  const settingsFree = s?.freeAbove ?? null;

  if (zones?.active) {
    return {
      eta: quote?.eta ?? zones.defEta ?? s?.eta ?? 59,
      fee: quote && !quote.free ? quote.fee : zones.defFee,
      freeAbove: quote?.freeOver ?? zones.freeOver ?? settingsFree,
      zonesMode: true,
    };
  }
  const village = selectedPlaces(areas, sel).at(-1);
  return {
    eta: village?.eta ?? areas?.eta ?? s?.eta ?? 59,
    fee: village?.fee ?? areas?.def ?? s?.feeMin ?? 0,
    freeAbove: areas?.free ?? settingsFree,
    zonesMode: false,
  };
}
