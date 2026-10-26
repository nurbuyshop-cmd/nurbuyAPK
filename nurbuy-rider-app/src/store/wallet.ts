import { create } from 'zustand';

import * as R from '@/api/rider';
import type { Wallet } from '@/api/rider';

import { useAuth } from './auth';

type State = {
  data: Wallet | null;
  error: unknown;
  load: () => Promise<Wallet | null>;
};

/** Balance, withdrawals and the last payout details, shared by the earnings and withdraw pages (website WAL). */
export const useWallet = create<State>((set) => ({
  data: null,
  error: null,
  load: async () => {
    try {
      const data = await R.wallet();
      set({ data, error: null });
      return data;
    } catch (e) {
      set({ error: e });
      return null;
    }
  },
}));

useAuth.subscribe((s, p) => {
  if (s.token !== p.token) useWallet.setState({ data: null, error: null });
});
