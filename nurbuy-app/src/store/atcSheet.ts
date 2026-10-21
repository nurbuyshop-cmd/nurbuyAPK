import { create } from 'zustand';

import { requireLogin } from './loginGate';

type State = {
  /** product shown in the add-to-cart sheet */
  productId: string | null;
  /** option chosen on the product page, preselected in the sheet */
  vid: string | null;
  /** "buy" goes to the cart right after adding */
  mode: 'cart' | 'buy';
  close: () => void;
};

export const useAtcSheet = create<State>((set) => ({
  productId: null,
  vid: null,
  mode: 'cart',
  close: () => set({ productId: null, vid: null }),
}));

/** Opens the add-to-cart sheet; a guest is asked to log in first and the sheet opens right after. */
export function openAtc(productId: string, mode: 'cart' | 'buy' = 'cart', vid: string | null = null) {
  requireLogin(() => useAtcSheet.setState({ productId, mode, vid }));
}
