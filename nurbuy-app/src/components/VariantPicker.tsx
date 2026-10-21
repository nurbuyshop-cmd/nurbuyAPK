import { Pressable, StyleSheet, View } from 'react-native';

import type { Variant, Variants } from '@/api/catalog';
import { attrNames, attrValues, pickVariant, valueSoldOut } from '@/lib/variants';
import { colors, TOUCH } from '@/theme';

import { Txt } from './Txt';

type Props = { vr: Variants; value: Variant; onChange: (v: Variant) => void };

/** One row of options per attribute (chips, or colour swatches for colour attributes). */
export function VariantPicker({ vr, value, onChange }: Props) {
  const attrs = attrNames(vr);
  if (!attrs.length) {
    // variants without attributes: pick by name
    return (
      <View style={styles.opts}>
        {vr.list.map((v) => (
          <Chip key={v.id} label={v.name} on={v.id === value.id} out={v.stock <= 0} onPress={() => onChange(v)} />
        ))}
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      {attrs.map((a) => (
        <View key={a.n}>
          <Txt size={13} color={colors.grey} style={styles.label}>
            {a.n + ': '}
            <Txt weight="bold" size={13}>{value.o[a.n] ?? ''}</Txt>
          </Txt>
          <View style={styles.opts}>
            {attrValues(vr, a.n).map((x) => (
              <Chip
                key={x}
                label={x}
                hex={a.t === 'color' ? vr.hex[x] : undefined}
                on={value.o[a.n] === x}
                out={valueSoldOut(vr, a.n, x)}
                onPress={() => onChange(pickVariant(vr, value, a.n, x))}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function Chip({ label, on, out, hex, onPress }: { label: string; on: boolean; out: boolean; hex?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, on && styles.chipOn, out && styles.out]}
      accessibilityRole="radio"
      accessibilityState={{ selected: on, disabled: out }}
      accessibilityLabel={label}
    >
      {hex ? <View style={[styles.swatch, { backgroundColor: hex }]} /> : null}
      <Txt weight={on ? 'bold' : 'medium'} size={13.5} color={on ? colors.primary : colors.text} style={out && styles.strike}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  label: { marginBottom: 6 },
  opts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: TOUCH - 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: '#eef0fa' },
  out: { opacity: 0.5 },
  strike: { textDecorationLine: 'line-through' },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)' },
});
