import { Pressable, StyleSheet, View } from 'react-native';

import { VEHICLES, type Vehicle } from '@/api/rider';
import { VEHICLE_ICON, VEHICLE_LABEL } from '@/lib/labels';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Bicycle / motorbike / car cards (website .vg .vc). */
export function VehiclePicker({ value, onChange, error }: { value: Vehicle | ''; onChange: (v: Vehicle) => void; error?: string }) {
  const t = useT();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {VEHICLES.map((k) => {
          const on = value === k;
          return (
            <Pressable
              key={k}
              onPress={() => onChange(k)}
              style={({ pressed }) => [styles.card, on && styles.on, !!error && !value && styles.bad, pressed && styles.pressed]}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={t(VEHICLE_LABEL[k])}
            >
              <Icon name={VEHICLE_ICON[k]} size={32} color={on ? colors.primary : colors.grey} />
              <Txt weight="semibold" size={14} color={on ? colors.primary : colors.text}>{t(VEHICLE_LABEL[k])}</Txt>
            </Pressable>
          );
        })}
      </View>
      {error ? <Txt size={13} color={colors.danger} accessibilityRole="alert">{error}</Txt> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginBottom: 13 },
  row: { flexDirection: 'row', gap: 8 },
  card: { flex: 1, minHeight: 92, borderRadius: 14, borderWidth: 1.5, borderColor: '#dfe3f1', backgroundColor: '#fafbff', alignItems: 'center', justifyContent: 'center', gap: 6 },
  on: { borderColor: colors.primary, backgroundColor: colors.infoBg },
  bad: { borderColor: colors.danger },
  pressed: { opacity: 0.7 },
});
