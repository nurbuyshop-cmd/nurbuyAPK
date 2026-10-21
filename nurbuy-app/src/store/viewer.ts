import { create } from 'zustand';

type State = {
  /** photo addresses in the full-screen viewer; empty = closed */
  urls: string[];
  start: number;
  open: (urls: string[], start?: number) => void;
  close: () => void;
};

/** Full-screen photo viewer (product gallery, chat photos). */
export const useViewer = create<State>((set) => ({
  urls: [],
  start: 0,
  open: (urls, start = 0) => (urls.length ? set({ urls, start }) : undefined),
  close: () => set({ urls: [], start: 0 }),
}));
