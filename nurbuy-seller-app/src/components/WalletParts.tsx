import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { EarnStatus, WdStatus, Withdrawal } from '@/api/wallet';
import type { StringKey } from '@/i18n/en';
import { dateTime, maskAcc, money } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';
import { Chip, type ChipTone } from './ui';

const WDS: Record<WdStatus, [StringKey, ChipTone]> = {
  pending: ['wsPending', 'amber'],
  processing: ['wsProcessing', 'purple'],
  completed: ['wsCompleted', 'green'],
  cancelled: ['wsCancelled', 'red'],
};
const ERS: Record<EarnStatus, [StringKey, ChipTone]> = {
  pending: ['esPending', 'amber'],
  available: ['esAvailable', 'green'],
  cancelled: ['esCancelled', 'red'],
};

export function WdChip({ st }: { st: WdStatus }) {
  const { t } = useLang();
  return <Chip label={t(WDS[st][0])} tone={WDS[st][1]} />;
}

export function EarnChip({ st }: { st: EarnStatus }) {
  const { t } = useLang();
  return <Chip label={t(ERS[st][0])} tone={ERS[st][1]} />;
}

const BKT: Record<string, StringKey> = { personal: 'btPersonal', agent: 'btAgent', merchant: 'btMerchant' };

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
  const { t, lang } = useLang();
  const payLine = usePayLine();
  return (
    <Pressable onPress={() => router.push({ pathname: '/wd/[id]', params: { id: String(w.id) } })} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
      <View style={styles.row}>
        <Txt weight="bold" size={15} latin style={styles.flex}>{w.no}</Txt>
        <WdChip st={w.status} />
      </View>
      <View style={styles.row}>
        <Icon name={w.method === 'bkash' ? 'wallet' : 'receipt'} size={17} color={colors.grey} />
        <Txt size={14} style={styles.flex}>{payLine(w, false)}</Txt>
      </View>
      {w.status === 'cancelled' && w.reason ? (
        <View style={styles.row}>
          <Icon name="info" size={17} color={colors.danger} />
          <Txt size={13.5} color={colors.danger} style={styles.flex}>{w.reason}</Txt>
        </View>
      ) : null}
      <View style={styles.foot}>
        <Txt weight="bold" size={16}>{money(w.amount, lang)}</Txt>
        <View style={styles.flex} />
        {w.status === 'completed' ? <Chip label={t('invoice')} tone="green" /> : null}
        <Txt size={12.5} color={colors.grey}>{dateTime(w.created_at, lang)}</Txt>
      </View>
    </Pressable>
  );
}

/** Pressable card used by earnings / invoices lists. */
export function ListCard({ onPress, children }: { onPress?: () => void; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole={onPress ? 'button' : undefined}>
      {children}
    </Pressable>
  );
}

export type Step = { label: string; state: 'done' | 'cur' | 'todo' | 'bad' };

/** Vertical progress steps with ticks (website .stp list). */
export function ProgressSteps({ steps }: { steps: Step[] }) {
  return (
    <View>
      {steps.map((s, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.rail}>
            <View style={[styles.dot, s.state === 'done' && styles.dotDone, s.state === 'cur' && styles.dotCur, s.state === 'bad' && styles.dotBad]}>
              {s.state === 'bad' ? <Icon name="x" size={13} color={colors.white} strokeWidth={3} /> : s.state !== 'todo' ? <Icon name="check" size={13} color={colors.white} strokeWidth={3} /> : null}
            </View>
            {i < steps.length - 1 ? <View style={[styles.railLine, s.state === 'done' && styles.railDone]} /> : null}
          </View>
          <Txt size={14.5} weight={s.state === 'cur' || s.state === 'bad' ? 'bold' : 'regular'} color={s.state === 'todo' ? colors.grey : s.state === 'bad' ? colors.danger : colors.text} style={styles.stepLabel}>
            {s.label}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/** Numbered step header (1 - 2 - 3 - 4) used by the withdraw wizard and the application form. */
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

/** Coloured round icon for statement rows. */
export function TxIcon({ effect }: { effect: number }) {
  const ic: IconName = effect > 0 ? 'plus' : effect < 0 ? 'logout' : 'check';
  const bg = effect > 0 ? colors.okBg : effect < 0 ? colors.dangerBg : '#eef0f6';
  const fg = effect > 0 ? colors.ok : effect < 0 ? colors.danger : colors.grey;
  return (
    <View style={[styles.txi, { backgroundColor: bg }]}>
      <Icon name={ic} size={17} color={fg} />
    </View>
  );
}

/* ---------- printed-looking invoice ---------- */

export function Invoice({ title, no, children }: { title: string; no: string; children: ReactNode }) {
  return (
    <View style={styles.inv}>
      <View style={styles.invHead}>
        <View>
          <Txt weight="bold" size={22} color={colors.primary} latin>NurBuy</Txt>
          <Txt size={12} color={colors.grey} latin>nurbuy.com</Txt>
        </View>
        <View style={styles.invT}>
          <Txt weight="bold" size={15} style={styles.right}>{title}</Txt>
          <Txt size={12.5} color={colors.grey} latin style={styles.right}>{no}</Txt>
        </View>
      </View>
      {children}
    </View>
  );
}

export function InvRow({ k, v, strong, dim }: { k: string; v: string; strong?: boolean; dim?: boolean }) {
  return (
    <View style={[styles.invRow, strong && styles.invTotal]}>
      <Txt size={strong ? 15 : 13.5} weight={strong ? 'bold' : 'regular'} color={dim ? colors.grey : colors.text} style={styles.flex}>{k}</Txt>
      <Txt size={strong ? 15.5 : 13.5} weight={strong ? 'bold' : 'semibold'} color={dim ? colors.grey : colors.text} style={styles.right}>{v}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  right: { textAlign: 'right' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  pressed: { opacity: 0.75 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  step: { flexDirection: 'row', gap: 12, minHeight: 42 },
  rail: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e6e9f3', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.ok },
  dotCur: { backgroundColor: colors.primary },
  dotBad: { backgroundColor: colors.danger },
  railLine: { flex: 1, width: 2, backgroundColor: '#e6e9f3', marginVertical: 2 },
  railDone: { backgroundColor: colors.ok },
  stepLabel: { paddingTop: 2, flex: 1 },
  prog: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 4 },
  stepWrap: { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { alignItems: 'center', gap: 4, width: 62 },
  line: { width: 18, height: 2, backgroundColor: colors.border, marginTop: 14 },
  lineOn: { backgroundColor: colors.primary },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e6e9f3', alignItems: 'center', justifyContent: 'center' },
  numOn: { backgroundColor: colors.primary },
  numDone: { backgroundColor: colors.ok },
  txi: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  inv: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  invHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: colors.primary },
  invT: { alignItems: 'flex-end', flexShrink: 1 },
  invRow: { flexDirection: 'row', gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#eef0f6' },
  invTotal: { borderBottomWidth: 0, borderTopWidth: 2, borderTopColor: colors.text, marginTop: 2 },
});
