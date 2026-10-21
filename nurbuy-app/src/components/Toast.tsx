import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/store/toast';

import { Txt } from './Txt';

/** Renders the current toast above the tab bar for 2.6 s. */
export function Toast() {
  const { text, id, hide } = useToast();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!text) return;
    const t = setTimeout(hide, 2600);
    return () => clearTimeout(t);
  }, [text, id, hide]);

  if (!text) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 84 }]} accessibilityLiveRegion="polite">
      <View style={styles.box}>
        <Txt weight="semibold" size={14} color="#fff" style={styles.text}>{text}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  box: { backgroundColor: '#151a2d', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11, maxWidth: 480 },
  text: { textAlign: 'center' },
});
