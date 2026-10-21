import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { dateOnly } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Sheet } from './Sheet';
import { Txt } from './Txt';

const pad = (x: number) => (x < 10 ? `0${x}` : String(x));
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};

const WD = { en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], bn: ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'] };
const MONTH = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
};

/** A date box (YYYY-MM-DD or empty); a tap opens a month calendar in a bottom sheet. */
export function DateField({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  const { t, n, lang } = useLang();
  const [open, setOpen] = useState(false);
  const cur = parse(value);
  const [month, setMonth] = useState(() => {
    const d = cur ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const first = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = ymd(new Date());

  return (
    <View style={styles.wrap}>
      <Txt weight="semibold" size={13.5} color="#333" style={styles.label}>{label}</Txt>
      <Pressable onPress={() => setOpen(true)} style={[styles.box, !!error && styles.bad]} accessibilityRole="button" accessibilityLabel={label}>
        <Icon name="clock" size={18} color={colors.grey} />
        <Txt size={15} color={cur ? '#111' : '#9aa1b8'} style={styles.flex} numberOfLines={1}>{cur ? dateOnly(cur.getTime(), lang) : t('noDate')}</Txt>
      </Pressable>
      {error ? <Txt size={13} color={colors.danger} style={styles.err}>{error}</Txt> : null}
      {open ? (
        <Sheet title={label} onClose={() => setOpen(false)}>
          <View style={styles.head}>
            <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.nav} accessibilityLabel="<">
              <Icon name="back" size={20} color={colors.primary} />
            </Pressable>
            <Txt weight="bold" size={16} style={styles.title}>{`${MONTH[lang][month.getMonth()]} ${n(month.getFullYear())}`}</Txt>
            <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.nav} accessibilityLabel=">">
              <Icon name="chevron" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {WD[lang].map((w) => (
              <View key={w} style={styles.cell}>
                <Txt size={12} color={colors.grey}>{w}</Txt>
              </View>
            ))}
            {cells.map((d, i) => {
              if (!d) return <View key={`e${i}`} style={styles.cell} />;
              const key = ymd(new Date(month.getFullYear(), month.getMonth(), d));
              const on = key === value;
              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  style={[styles.cell, styles.day, on && styles.dayOn, key === today && !on && styles.today]}
                  accessibilityRole="button"
                >
                  <Txt weight={on ? 'bold' : 'regular'} size={14.5} color={on ? colors.white : colors.text}>{n(d)}</Txt>
                </Pressable>
              );
            })}
          </View>
          <Button
            variant="secondary"
            label={t('clear')}
            onPress={() => {
              onChange('');
              setOpen(false);
            }}
          />
        </Sheet>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 13, flex: 1, minWidth: 0 },
  label: { marginBottom: 6 },
  box: { minHeight: 50, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#fafbff', flexDirection: 'row', alignItems: 'center', gap: 8 },
  bad: { borderColor: colors.danger },
  flex: { flex: 1, minWidth: 0 },
  err: { marginTop: 5 },
  head: { flexDirection: 'row', alignItems: 'center' },
  nav: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', height: 44, alignItems: 'center', justifyContent: 'center' },
  day: { borderRadius: 22 },
  dayOn: { backgroundColor: colors.primary },
  today: { borderWidth: 1.5, borderColor: colors.primary },
});
