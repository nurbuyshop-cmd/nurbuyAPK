import { create } from 'zustand';

import { accessInfo, forgetMe, toAccessInfo, type AccessInfo } from '@/api/access';
import { local } from '@/lib/storage';
import { visitorId } from '@/lib/visitor';

const CONSENT_KEY = 'nb_consent';
const INFO_KEY = 'nb_access';

const isChoice = (v: unknown): v is 0 | 1 => v === 0 || v === 1;
const isInfo = (v: unknown): v is AccessInfo => toAccessInfo(v) !== null;

type State = {
  /** null = not answered yet, 1 = accepted tracking, 0 = essential only. */
  consent: 0 | 1 | null;
  info: AccessInfo | null;
  hydrate: () => Promise<void>;
  setConsent: (v: 0 | 1) => Promise<void>;
};

export const useConsent = create<State>((set, get) => ({
  consent: null,
  info: null,

  hydrate: async () => {
    const [c, info] = await Promise.all([local.get(CONSENT_KEY, isChoice), local.get(INFO_KEY, isInfo)]);
    set({ consent: c, info });
    // refresh in the background so the splash never waits for the network
    accessInfo()
      .then((fresh) => {
        set({ info: fresh });
        return local.set(INFO_KEY, fresh);
      })
      .catch(() => {
        // keep the cached copy
      });
  },

  setConsent: async (v) => {
    const prev = get().consent;
    set({ consent: v });
    await local.set(CONSENT_KEY, v);
    // withdrawing consent erases what was stored about this visitor
    if (v === 0 && prev === 1) {
      try {
        await forgetMe(await visitorId());
      } catch {
        // retried the next time the customer changes the choice
      }
    }
  },
}));

/** The consent question is shown while personalisation is on and the customer has not answered yet. */
export function needsConsent(s: Pick<State, 'consent' | 'info'>): boolean {
  return !!s.info && s.info.personalization === 1 && s.consent === null;
}

/** Tracking with consent (c:1) and personalisation are used only after the customer accepted. */
export function trackingAllowed(s: Pick<State, 'consent' | 'info'>): boolean {
  return !!s.info && s.info.personalization === 1 && s.consent === 1;
}
