import { create } from 'zustand';

import * as W from '@/api/wallet';
import type { Earning, Wallet } from '@/api/wallet';

import { useAuth } from './auth';

type State = {
  data: Wallet | null;
  error: unknown;
  load: () => Promise<Wallet | null>;
};

/** The wallet (balance, earnings, withdrawals, statement), shared by the wallet, withdraw and invoice pages. */
export const useWallet = create<State>((set) => ({
  data: null,
  error: null,
  load: async () => {
    try {
      const data = await W.wallet();
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

export type SalesGroup = { id: string; lines: Earning[]; at: number; sale: number; disc: number; com: number; net: number; st: 'pending' | 'available' | 'cancelled' };

/** Earnings grouped by order = one sales invoice each (website salesGroups()). */
export function salesGroups(earnings: Earning[]): SalesGroup[] {
  const map = new Map<string, Earning[]>();
  for (const e of earnings) {
    const l = map.get(e.order_id);
    if (l) l.push(e);
    else map.set(e.order_id, [e]);
  }
  return [...map.entries()].map(([id, lines]) => {
    const g: SalesGroup = { id, lines, at: lines[0]?.order_at ?? 0, sale: 0, disc: 0, com: 0, net: 0, st: 'available' };
    for (const e of lines) {
      g.sale += e.sale;
      g.disc += e.disc;
      g.com += e.commission;
      g.net += e.net;
    }
    const sts = lines.map((e) => e.status);
    g.st = sts.includes('pending') ? 'pending' : sts.every((x) => x === 'cancelled') ? 'cancelled' : 'available';
    return g;
  });
}
