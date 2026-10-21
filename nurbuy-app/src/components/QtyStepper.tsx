import { Pressable, StyleSheet, View } from 'react-native';

import { digits, useI18n, useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

type Props = { value: number; max: number; onChange: (q: number) => void; onLimit?: () => void };

/** − 1 + control; tapping + at the limit calls onLimit (to explain the per-order limit). */
export function QtyStepper({ value, max, onChange, onLimit }: Props) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  return (
    <View style={styles.row} accessibilityLabel={t('quantity')}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        style={[styles.btn, value <= 1 && styles.off]}
        accessibilityRole="button"
        accessibilityLabel="-"
      >
        <Icon name="minus" size={20} color={colors.text} strokeWidth={2.4} />
      </Pressable>
      <Txt weight="bold" size={17} style={styles.val}>{digits(value, lang)}</Txt>
      <Pressable
        onPress={() => (value >= max ? onLimit?.() : onChange(value + 1))}
        style={[styles.btn, value >= max && styles.off]}
        accessibilityRole="button"
        accessibilityLabel="+"
      >
        <Icon name="plus" size={20} color={colors.text} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f9', borderRadius: 14 },
  btn: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  off: { opacity: 0.4 },
  val: { minWidth: 32, textAlign: 'center' },
});
