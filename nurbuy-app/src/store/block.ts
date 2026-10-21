import { create } from 'zustand';

import type { BlockInfo } from '@/api/api';

type State = {
  /** Set when the server answered "blocked"; the root layout then opens the restricted screen. */
  block: BlockInfo | null;
  setBlock: (b: BlockInfo | null) => void;
};

export const useBlock = create<State>((set) => ({
  block: null,
  setBlock: (block) => set({ block }),
}));
