import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Place } from '@/api/geo';
import { useI18n, useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt, useInputFont } from './Txt';

type Props = { label: string; value: Place | undefined; options: Place[]; disabled?: boolean; onPick: (p: Place) => void };

/** Dropdown field that opens a searchable list (district, thana / upazila, village / area). */
export function PlaceSelect({ label, value, options, disabled, onPick }: Props) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const font = useInputFont();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const name = (p: Place) => (lang === 'bn' ? p.bn : p.n);
  const s = q.trim().toLowerCase();
  const list = s ? options.filter((p) => `${p.n} ${p.bn}`.toLowerCase().includes(s)) : options;

  return (
    <>
      <Txt weight="bold" size={13} color="#333" style={styles.label}>{label}</Txt>
      <Pressable
        onPress={() => {
          setQ('');
          setOpen(true);
        }}
        disabled={disabled || !options.length}
        style={[styles.field, (disabled || !options.length) && styles.off]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Txt size={15} color={value ? colors.text : '#9aa1b8'} numberOfLines={1} style={styles.flex}>{value ? name(value) : label}</Txt>
        <Icon name="chevron" size={18} color={colors.grey} />
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={[styles.page, { paddingTop: insets.top + 8 }]}>
          <View style={styles.head}>
            <Pressable onPress={() => setOpen(false)} style={styles.x} accessibilityRole="button" accessibilityLabel={t('close')}>
              <Icon name="x" size={22} color={colors.text} />
            </Pressable>
            <Txt weight="bold" size={17}>{label}</Txt>
          </View>
          <View style={styles.search}>
            <Icon name="search" size={18} color={colors.grey} />
            <TextInput value={q} onChangeText={setQ} placeholder={t('searchPlacePh')} placeholderTextColor="#9aa1b8" style={[styles.input, { fontFamily: font }]} autoFocus />
          </View>
          <FlatList
            data={list}
            keyExtractor={(p) => String(p.id)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onPick(item);
                  setOpen(false);
                }}
                style={[styles.row, value?.id === item.id && styles.rowOn]}
                accessibilityRole="button"
              >
                <Txt size={15.5} style={styles.flex}>{name(item)}</Txt>
                {value?.id === item.id ? <Icon name="check" size={20} color={colors.primary} strokeWidth={2.4} /> : null}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, marginTop: 10 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 50, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#fafbff' },
  off: { opacity: 0.5 },
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: colors.white },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  x: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, height: 46, borderRadius: 23, backgroundColor: '#f1f3f9', paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#f0f1f6' },
  rowOn: { backgroundColor: '#eef0fa' },
});
