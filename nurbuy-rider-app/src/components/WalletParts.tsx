import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Withdrawal, WdStatus } from '@/api/rider';
import type { StringKey } from '@/i18n/en';
import { dateTime, maskAcc, money } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { Chip, type ChipTone } from './ui';

/** Row of filter chips (website .filters .fc); scrolls sideways when it does not fit. */
export function Filters<K extends string>({ items, value, onChange }: { items: [K, string][]; value: K; onChange: (k: K) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
      {items.map(([k, label]) => {
        const on = k === value;
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={[styles.fc, on && styles.fcOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Txt weight={on ? 'bold' : 'medium'} size={14} color={on ? colors.white : colors.text}>{label}</Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Website WDS. */
const WDS: Record<WdStatus, [StringKey, ChipTone]> = {
  pending: ['wdPending', 'amber'],
  processing: ['wdProcessing', 'purple'],
  completed: ['wdPaid', 'green'],
  cancelled: ['wdCancelled', 'red'],
};

export function WdChip({ st }: { st: WdStatus }) {
  const { t } = useLang();
  return <Chip label={t(WDS[st][0])} tone={WDS[st][1]} />;
}

export const BKT: Record<string, StringKey> = { personal: 'btPersonal', agent: 'btAgent', merchant: 'btMerchant' };

/** "bKash 017... (Personal)" or "Bank, Branch A/C ****1234" (website payLine()). */
export function usePayLine() {
  const { t, n } = useLang();
  return (w: Withdrawal, full: boolean) => {
    const d = w.details;
    if (w.method === 'bkash') {
      const tk = d.acc_type ? BKT[d.acc_type] : undefined;
      return `${t('bkash')} ${n(d.number ?? '')}${tk ? ` (${t(tk)})` : ''}`;
    }
    const acc = d.acc_no ?? '';
    return `${d.bank ?? ''}, ${d.branch ?? ''} ${t('accShort')} ${n(full ? acc : maskAcc(acc))}`;
  };
}

/** One withdrawal in a list (website wdCard()). */
export function WdCard({ w }: { w: Withdrawal }) {
  const { lang } = useLang();
  const payLine = usePayLine();
  return (
    <Pressable onPress={() => router.push({ pathname: '/wd/[id]', params: { id: String(w.id) } })} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
      <View style={styles.row}>
        <Txt weight="bold" size={15} latin style={styles.flex}>{w.no}</Txt>
        <WdChip st={w.status} />
      </View>
      <View style={styles.row}>
        <Icon name={w.method === 'bkash' ? 'phone' : 'bank'} size={17} color={colors.grey} />
        <Txt size={14} style={styles.flex}>{payLine(w, false)}</Txt>
      </View>
      {w.status === 'cancelled' && w.reason ? <Txt size={13.5} color={colors.danger}>{w.reason}</Txt> : null}
      <View style={styles.foot}>
        <Txt weight="bold" size={16}>{money(w.amount, lang)}</Txt>
        <View style={styles.flex} />
        <Txt size={12.5} color={colors.grey}>{dateTime(w.created_at, lang)}</Txt>
      </View>
    </Pressable>
  );
}

/** Numbered step header (1 - 2 - 3 - 4) used by the withdraw wizard. */
export function StepHeader({ names, step }: { names: string[]; step: number }) {
  const { n } = useLang();
  return (
    <View style={styles.prog}>
      {names.map((nm, i) => {
        const s = i + 1;
        const on = s === step;
        const done = s < step;
        return (
          <View key={nm} style={styles.stepWrap}>
            {i > 0 ? <View style={[styles.line, (done || on) && styles.lineOn]} /> : null}
            <View style={styles.stepCol}>
              <View style={[styles.num, on && styles.numOn, done && styles.numDone]}>
                {done ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : <Txt weight="bold" size={12.5} color={on ? colors.white : colors.grey}>{n(s)}</Txt>}
              </View>
              <Txt size={11.5} weight="semibold" color={on ? colors.primary : colors.grey} numberOfLines={1}>{nm}</Txt>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  filters: { gap: 8, paddingHorizontal: 14, paddingVertical: 6 },
  fc: { minHeight: 40, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border, justifyContent: 'center' },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  pressed: { opacity: 0.75 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  prog: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 4 },
  stepWrap: { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { alignItems: 'center', gap: 4, width: 62 },
  line: { width: 18, height: 2, backgroundColor: colors.border, marginTop: 14 },
  lineOn: { backgroundColor: colors.primary },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e6e9f3', alignItems: 'center', justifyContent: 'center' },
  numOn: { backgroundColor: colors.primary },
  numDone: { backgroundColor: colors.ok },
});
