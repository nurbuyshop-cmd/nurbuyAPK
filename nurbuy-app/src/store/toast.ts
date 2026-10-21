import { create } from 'zustand';

type State = { text: string | null; id: number; show: (text: string) => void; hide: () => void };

/** Short bottom message, like the website's msg(). */
export const useToast = create<State>((set) => ({
  text: null,
  id: 0,
  show: (text) => set((s) => ({ text, id: s.id + 1 })),
  hide: () => set({ text: null }),
}));

export const toast = (text: string) => useToast.getState().show(text);
