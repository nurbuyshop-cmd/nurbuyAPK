import { create } from 'zustand';

import { useAuth } from './auth';

type State = {
  /** The popup "Create an account or log in to continue" is open. */
  open: boolean;
  /** Runs once after a successful login, so the customer's tap (add to cart, wishlist...) completes by itself. */
  pending: (() => void) | null;
  close: () => void;
  runPending: () => void;
};

export const useLoginGate = create<State>((set, get) => ({
  open: false,
  pending: null,
  close: () => set({ open: false, pending: null }),
  runPending: () => {
    const fn = get().pending;
    set({ open: false, pending: null });
    fn?.();
  },
}));

/** Runs the action now when signed in; otherwise asks the customer to log in first and runs it afterwards. */
export function requireLogin(action: () => void) {
  if (useAuth.getState().status === 'user') {
    action();
    return;
  }
  useLoginGate.setState({ open: true, pending: action });
}
