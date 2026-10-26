import { create } from 'zustand';

export type ToastType = 'info' | 'ok' | 'bad';

type State = { text: string | null; type: ToastType; id: number; ms: number; show: (text: string, type?: ToastType, ms?: number) => void; hide: () => void };

/** Short message at the bottom, like the website's toast(). */
export const useToast = create<State>((set) => ({
  text: null,
  type: 'info',
  id: 0,
  ms: 3200,
  show: (text, type = 'info', ms = 3200) => set((s) => ({ text, type, ms, id: s.id + 1 })),
  hide: () => set({ text: null }),
}));

export const toast = (text: string, type?: ToastType, ms?: number) => useToast.getState().show(text, type, ms);
