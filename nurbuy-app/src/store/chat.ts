import { AppState } from 'react-native';
import { create } from 'zustand';

import { chatRead, chatSend, chatSync, type ChatConv, type ChatMsg, type SendBody } from '@/api/chat';
import { ApiError } from '@/api/api';

import { useAuth } from './auth';

type State = {
  convs: ChatConv[];
  msgs: ChatMsg[];
  last: number;
  /** the chat screen is open: poll every 3 s instead of 15 s */
  open: boolean;
  setOpen: (v: boolean) => void;
  sync: () => Promise<void>;
  /** sends into the newest open conversation, or starts a new one */
  send: (b: Omit<SendBody, 'conv'>) => Promise<void>;
  markRead: () => void;
};

/** Support chat with NurBuy agents (polling, like the website). Only for signed-in customers. */
export const useChat = create<State>((set, get) => ({
  convs: [],
  msgs: [],
  last: 0,
  open: false,
  setOpen: (open) => {
    set({ open });
    if (open) {
      void get().sync().then(() => get().markRead());
      schedule(0);
    }
  },
  sync: async () => {
    if (useAuth.getState().status !== 'user') return;
    try {
      const r = await chatSync(get().last);
      const known = new Set(get().msgs.map((m) => m.id));
      const msgs = [...get().msgs, ...r.msgs.filter((m) => !known.has(m.id))].sort((a, b) => a.id - b.id);
      set({ convs: r.convs, msgs, last: Math.max(get().last, r.last) });
      if (get().open && r.msgs.some((m) => m.from !== 'c')) get().markRead();
    } catch {
      // the next poll tries again
    }
  },
  send: async (b) => {
    const cur = currentConv(get().convs);
    try {
      const r = await chatSend({ ...b, conv: cur?.id });
      add(r.msg, r.conv);
    } catch (e) {
      // a resolved conversation cannot take new messages: start a fresh one
      if (e instanceof ApiError && e.code === 'resolved') {
        const r = await chatSend(b);
        add(r.msg, r.conv);
      } else throw e;
    }
  },
  markRead: () => {
    get()
      .convs.filter((c) => c.unread > 0)
      .forEach((c) => {
        chatRead(c.id).catch(() => {});
      });
    set({ convs: get().convs.map((c) => ({ ...c, unread: 0 })) });
  },
}));

function add(msg: ChatMsg, conv: ChatConv) {
  const s = useChat.getState();
  useChat.setState({
    msgs: s.msgs.some((m) => m.id === msg.id) ? s.msgs : [...s.msgs, msg],
    convs: [conv, ...s.convs.filter((c) => c.id !== conv.id)],
    last: s.last,
  });
}

/** The conversation new messages go to: the newest one that is not resolved. */
export function currentConv(convs: ChatConv[]): ChatConv | undefined {
  return [...convs].sort((a, b) => b.lastAt - a.lastAt).find((c) => c.status !== 'resolved');
}

/** Unread replies from support (badge on the chat button). */
export const chatUnread = (s: Pick<State, 'convs'>) => s.convs.reduce((a, c) => a + c.unread, 0);

let timer: ReturnType<typeof setTimeout> | null = null;

function schedule(ms?: number) {
  if (timer) clearTimeout(timer);
  timer = null;
  if (useAuth.getState().status !== 'user') return;
  const delay = ms ?? (useChat.getState().open ? 3000 : 15000);
  timer = setTimeout(async () => {
    if (AppState.currentState === 'active') await useChat.getState().sync();
    schedule();
  }, delay);
}

if (useAuth.getState().status === 'user') schedule(1000);

// polling runs while a customer is signed in; a sign-out forgets the conversation on this phone
useAuth.subscribe((s, prev) => {
  if (s.status === prev.status) return;
  if (s.status === 'user') schedule(1000);
  else {
    if (timer) clearTimeout(timer);
    timer = null;
    useChat.setState({ convs: [], msgs: [], last: 0 });
  }
});
