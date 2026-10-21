import * as Device from 'expo-device';
import { Dimensions, PixelRatio } from 'react-native';
import { create } from 'zustand';

import { local } from '@/lib/storage';

const KEY = 'nb_lite';
const isChoice = (v: unknown): v is boolean => typeof v === 'boolean';

/** Same rule as the website: 4 GB RAM or less, or a screen below HD (720 px wide), counts as a weak phone. */
function weakPhone(): boolean {
  const ram = Device.totalMemory ?? 0;
  const { width, height } = Dimensions.get('screen');
  const px = Math.min(width, height) * PixelRatio.get();
  return (ram > 0 && ram <= 4 * 1024 ** 3) || px < 720;
}

type State = {
  /** detected on this phone */
  auto: boolean;
  /** the customer's own choice, or null to follow the detection */
  choice: boolean | null;
  hydrate: () => Promise<void>;
  set: (on: boolean) => void;
};

/**
 * Lite mode for weak phones: smaller list photos (320 px instead of 480 px), still banners without animation,
 * and no image fade-ins.
 */
export const useLite = create<State>((set) => ({
  auto: weakPhone(),
  choice: null,
  hydrate: async () => {
    const c = await local.get(KEY, isChoice);
    if (c !== null) set({ choice: c });
  },
  set: (on) => {
    set({ choice: on });
    void local.set(KEY, on);
  },
}));

// the switch was removed from the profile, so only the phone check decides (an old saved choice is ignored)
export const liteOn = (s: Pick<State, 'auto' | 'choice'>) => s.auto;
