import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { Icon } from './Icon';
import { Sheet } from './Sheet';
import { Txt } from './Txt';

export type Option<T extends string | number> = { value: T; label: string };

/** A dropdown: shows the chosen option; a tap opens a list in a bottom sheet (website <select>). */
export function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: T | null;
  options: Option<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const cur = options.find((o) => o.value === value);
  return (
    <View style={styles.wrap}>
      <Txt weight="semibold" size={13.5} color="#333" style={styles.label}>
        {label}
        {required ? <Txt color={colors.danger}> *</Txt> : null}
      </Txt>
      <Pressable onPress={() => setOpen(true)} style={[styles.box, !!error && styles.bad]} accessibilityRole="button" accessibilityLabel={label}>
        <Txt size={15.5} color={cur ? '#111' : '#9aa1b8'} style={styles.flex} numberOfLines={1}>{cur ? cur.label : placeholder ?? ''}</Txt>
        <Icon name="chevron" size={18} color={colors.grey} />
      </Pressable>
      {error ? <Txt size={13} color={colors.danger} style={styles.err}>{error}</Txt> : null}
      {open ? (
        <Sheet title={label} onClose={() => setOpen(false)}>
          {options.map((o) => {
            const on = o.value === value;
            return (
              <Pressable
                key={String(o.value)}
                onPress={() => {
                  setOpen(false);
                  onChange(o.value);
                }}
                style={[styles.opt, on && styles.optOn]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                <Txt size={15.5} weight={on ? 'bold' : 'regular'} color={on ? colors.primary : colors.text} style={styles.flex}>{o.label}</Txt>
                {on ? <Icon name="check" size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </Sheet>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 13 },
  label: { marginBottom: 6 },
  box: { minHeight: 50, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#fafbff', flexDirection: 'row', alignItems: 'center', gap: 8 },
  bad: { borderColor: colors.danger },
  flex: { flex: 1, minWidth: 0 },
  err: { marginTop: 5 },
  opt: { flexDirection: 'row', alignItems: 'center', minHeight: 50, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#f6f7fb' },
  optOn: { backgroundColor: colors.infoBg },
});
