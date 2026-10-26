import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

let player: AudioPlayer | null = null;

/** Short chime when a new order arrives while the app is open (the website beeps too). Never throws. */
export function playNewOrder(): void {
  try {
    if (!player) {
      // mixes with music instead of stopping it
      void setAudioModeAsync({ interruptionMode: 'mixWithOthers', playsInSilentMode: false }).catch(() => {});
      player = createAudioPlayer(require('../../assets/new_order.wav'));
    }
    void player.seekTo(0).then(() => player?.play()).catch(() => {});
  } catch {
    // no sound on this phone: the on-screen message is still shown
  }
}
