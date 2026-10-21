import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

// the 4-second logo animation, shipped inside the app so it starts at once even without internet
const SOURCE = require('../../assets/intro.mp4') as number;
// if the video cannot play for some reason, the app still opens after this long
const FALLBACK_MS = 6000;

type Props = {
  /** the app behind is ready to be shown */
  appReady: boolean;
  onFinished: () => void;
};

/**
 * Full-screen intro on every app start: the NurBuy logo animation on white (same as the splash), then a short fade to
 * the app. When the app is still loading at the end, the last frame (the logo) stays until it is ready. A tap skips it.
 */
export function IntroVideo({ appReady, onFinished }: Props) {
  const [ended, setEnded] = useState(false);
  const [fade] = useState(() => new Animated.Value(1));
  const player = useVideoPlayer(SOURCE, (p) => {
    p.muted = true;
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    const end = player.addListener('playToEnd', () => setEnded(true));
    const status = player.addListener('statusChange', ({ status: s }) => {
      if (s === 'error') setEnded(true);
    });
    const timer = setTimeout(() => setEnded(true), FALLBACK_MS);
    return () => {
      end.remove();
      status.remove();
      clearTimeout(timer);
    };
  }, [player]);

  useEffect(() => {
    if (!ended || !appReady) return;
    Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => onFinished());
  }, [ended, appReady, fade, onFinished]);

  return (
    <Animated.View style={[styles.full, { opacity: fade }]}>
      <Pressable style={styles.flex} onPress={() => setEnded(true)} accessibilityLabel="NurBuy">
        <VideoView player={player} style={styles.flex} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  full: { ...StyleSheet.absoluteFill, backgroundColor: '#ffffff', zIndex: 100, elevation: 100 },
  flex: { flex: 1 },
});
