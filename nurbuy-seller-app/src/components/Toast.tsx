import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/store/toast';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Renders the current toast above the bottom bar for a few seconds. */
export function Toast() {
  const { text, type, id, ms, hide } = useToast();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!text) return;
    const t = setTimeout(hide, ms);
    return () => clearTimeout(t);
  }, [text, id, ms, hide]);

  if (!text) return null;
  const ic = type === 'ok' ? 'check' : type === 'bad' ? 'alert' : 'info';
  const tint = type === 'ok' ? '#4ade80' : type === 'bad' ? '#fb7185' : '#93a8ff';
  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + 84 }]} accessibilityLiveRegion="polite">
      <View style={styles.box}>
        <Icon name={ic} size={19} color={tint} />
        <Txt weight="semibold" size={14} color={colors.white} style={styles.text}>{text}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 950, elevation: 50 },
  box: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#151a2d', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11, maxWidth: 480 },
  text: { flexShrink: 1 },
});
