import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { boostAction, createBoost, type AdStatus, type Campaign, type LedgerRow } from '@/api/shop';
import type { StringKey } from '@/i18n/en';
import { errorText } from '@/lib/errors';
import { isMoney, money, numText } from '@/lib/format';
import { digits, useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

import { Button } from './Button';
import { Field } from './Field';
import { Icon } from './Icon';
import { Select } from './Select';
import { Sheet } from './Sheet';
import { Txt } from './Txt';
import { Banner, Chip, type ChipTone } from './ui';

const ADS: Record<AdStatus, [StringKey, ChipTone]> = {
  pending: ['adPending', 'amber'],
  active: ['adActive', 'green'],
  paused: ['adPaused', 'grey'],
  ended: ['adEnded', 'grey'],
  rejected: ['adRejected', 'red'],
  cancelled: ['adCancelled', 'grey'],
};

/** ৳12.50 (boost charges keep two decimals, website money2()). */
export const money2 = (x: number, lang: 'en' | 'bn') => `৳${digits((Number(x) || 0).toFixed(2), lang)}`;

const day = (ms: number | null, lang: 'en' | 'bn') => {
  if (!ms) return '-';
  const d = new Date(ms);
  return digits(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, lang);
};

/** One boost with its numbers and Pause / Resume / Stop (website adCard()). */
export function BoostCard({ c, full, onChanged }: { c: Campaign; full?: boolean; onChanged: () => void }) {
  const { t, n, f, lang } = useLang();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmStop, setConfirmStop] = useState(false);
  const name = c.product ? (lang === 'bn' && c.product.bn ? c.product.bn : c.product.name) : `#${c.product_id}`;
  const [k, tone] = ADS[c.status];

  const act = async (a: 'pause' | 'resume' | 'cancel') => {
    setBusy(a);
    try {
      await boostAction(c.id, a);
      toast(t('updated'), 'ok');
      onChanged();
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const cell = (label: string, v: string) => (
    <View style={styles.cell} key={label}>
      <Txt size={11.5} color={colors.grey}>{label}</Txt>
      <Txt weight="bold" size={15}>{v}</Txt>
    </View>
  );
  const pause = c.pause_reason === 'balance' ? t('pauseBalance') : c.pause_reason === 'admin' ? t('pauseAdmin') : c.pause_reason === 'seller' ? t('pauseSeller') : '';

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {c.product?.img ? <Image source={{ uri: c.product.img }} style={styles.img} contentFit="cover" /> : <View style={styles.img} />}
        <View style={styles.grow}>
          <Txt weight="semibold" size={15} numberOfLines={1}>{name}</Txt>
          <Txt size={12.5} color={colors.grey}>
            {`#${n(c.id)} · ${c.start_at ? `${day(c.start_at, lang)} – ${day(c.end_at, lang)}` : f('nDays', { n: c.days })}${c.daily_cap ? ` · ${f('dailyLimit', { a: money(c.daily_cap, lang) })}` : ''}`}
          </Txt>
        </View>
        <Chip label={t(k)} tone={tone} />
      </View>
      {c.reject_reason ? (
        <View style={styles.rsn}>
          <Txt weight="bold" size={12.5} color={colors.danger}>{t('reason')}</Txt>
          <Txt size={14}>{c.reject_reason}</Txt>
        </View>
      ) : null}
      {c.status === 'paused' && pause ? <Txt size={13} color={colors.grey}>{pause}</Txt> : null}
      <View style={styles.stats}>
        {cell(t('impressions'), n(c.imp))}
        {cell(t('clicks'), n(c.clicks))}
        {cell('CTR', `${n(c.ctr)}%`)}
        {cell(t('impCost'), money2(c.imp_cost, lang))}
        {cell(t('clickCost'), money2(c.click_cost, lang))}
        {cell(t('totalCost'), money2(c.cost, lang))}
        {cell(t('freeUsed'), money2(c.paid.promo, lang))}
        {cell(t('fromWallet'), money2(c.paid.wallet, lang))}
        {cell(t('outstanding'), money2(c.paid.debt + c.unpaid, lang))}
      </View>
      <View style={styles.acts}>
        {c.status === 'active' ? <Button small variant="secondary" label={t('pause')} busy={busy === 'pause'} onPress={() => void act('pause')} style={styles.grow} /> : null}
        {c.status === 'paused' && c.pause_reason !== 'admin' ? <Button small variant="secondary" label={t('resume')} busy={busy === 'resume'} onPress={() => void act('resume')} style={styles.grow} /> : null}
        {['pending', 'active', 'paused'].includes(c.status) ? (
          <Button small variant="danger" label={c.status === 'pending' ? t('cancelReq') : t('stop')} busy={busy === 'cancel'} onPress={() => setConfirmStop(true)} style={styles.grow} />
        ) : null}
        {!full ? <Button small variant="ghost" label={t('details')} onPress={() => router.push({ pathname: '/boost/[id]', params: { id: String(c.id) } })} style={styles.grow} /> : null}
      </View>
      {confirmStop ? (
        <Sheet title={t('stopBoostQ')} onClose={() => setConfirmStop(false)}>
          <Button
            variant="dangerSolid"
            label={c.status === 'pending' ? t('cancelReq') : t('stop')}
            onPress={() => {
              setConfirmStop(false);
              void act('cancel');
            }}
          />
          <Button variant="ghost" label={t('back')} onPress={() => setConfirmStop(false)} />
        </Sheet>
      ) : null}
    </View>
  );
}

/** Charge history (website adLedger()). */
export function Ledger({ rows }: { rows: LedgerRow[] }) {
  const { t, n, lang } = useLang();
  if (!rows.length) return <Txt size={13.5} color={colors.grey}>{t('noCharges')}</Txt>;
  return (
    <View>
      {rows.map((r) => (
        <View key={r.id} style={styles.lrow}>
          <View style={styles.grow}>
            <Txt weight="semibold" size={14}>{`${r.kind === 'charge' ? t('boostCharge') : r.kind === 'repay' ? t('outstandingPaid') : r.kind}${r.campaign_id ? ` #${n(r.campaign_id)}` : ''}`}</Txt>
            <Txt size={12} color={colors.grey}>
              {`${day(r.at, lang)}${r.imp || r.clicks ? ` · ${n(r.imp)} ${t('views')} · ${n(r.clicks)} ${t('clicksW')}` : ''}`}
            </Txt>
            <Txt size={12} color={colors.grey}>{`${t('freeCredit')} ${money2(r.promo, lang)} · ${t('wallet')} ${money2(r.wallet, lang)} · ${t('outstanding')} ${money2(r.debt, lang)}`}</Txt>
          </View>
          <Txt weight="bold" size={15}>{money2(r.amount, lang)}</Txt>
        </View>
      ))}
    </View>
  );
}

/** Request a boost for a live product (website ACT.boostnew). */
export function BoostSheet({ productId, name, rates, maxDays, onClose }: { productId: number; name: string; rates?: { imp1000: number; click: number }; maxDays?: number; onClose: () => void }) {
  const { t, f, lang } = useLang();
  const r = rates ?? { imp1000: 10, click: 1 };
  const [days, setDays] = useState(7);
  const [cap, setCap] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    const c = numText(cap);
    if (c !== '' && !(isMoney(c) && Number(c) >= 1)) {
      setErr(t('fCap'));
      return;
    }
    setBusy(true);
    try {
      await createBoost({ product_id: productId, days, daily_cap: c === '' ? null : Number(c), note: note.trim() });
      toast(t('boostSent'), 'ok', 4000);
      onClose();
      router.push('/boost');
    } catch (e) {
      setBusy(false);
      toast(errorText(e, t), 'bad', 5000);
    }
  };
  return (
    <Sheet title={t('boostProduct')} sub={name} onClose={onClose}>
      <Select
        label={t('howManyDays')}
        required
        value={days}
        options={[1, 3, 7, 14, 30].filter((d) => d <= (maxDays ?? 30)).map((d) => ({ value: d, label: f('nDays', { n: d }) }))}
        onChange={setDays}
      />
      <Field
        label={t('dailyCap')}
        keyboardType="decimal-pad"
        maxLength={8}
        value={cap}
        onChangeText={(x) => {
          setCap(x);
          setErr('');
        }}
        hint={t('dailyCapHint')}
        error={err}
      />
      <Field label={t('noteNb')} maxLength={200} value={note} onChangeText={setNote} />
      <Banner>{f('boostInfo', { a: money(r.imp1000, lang), b: money(r.click, lang) })}</Banner>
      <Button label={t('sendRequest')} icon="bolt" busy={busy} onPress={() => void send()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** Blue account box (website adAccount()). */
export function AccountBox({ a }: { a: { promo_total: number; promo_used: number; promo_left: number; wallet_available: number; debt: number; charged: number; rates: { imp1000: number; click: number } } }) {
  const { t, f, lang } = useLang();
  const used = a.promo_total ? Math.min(100, (a.promo_used / a.promo_total) * 100) : 100;
  const v = (label: string, x: number) => (
    <View style={styles.accCell} key={label}>
      <Txt size={12} color="rgba(255,255,255,0.8)">{label}</Txt>
      <Txt weight="bold" size={18} color={colors.white}>{money2(x, lang)}</Txt>
    </View>
  );
  return (
    <View style={styles.acc}>
      <View style={styles.accHead}>
        <Icon name="bolt" size={20} color={colors.white} />
        <Txt weight="bold" size={16} color={colors.white}>{t('boostAccount')}</Txt>
      </View>
      <View style={styles.accGrid}>
        {v(t('freeLeft'), a.promo_left)}
        {v(t('walletBal'), a.wallet_available)}
        {v(t('outstanding'), a.debt)}
        {v(t('totalCharged'), a.charged)}
      </View>
      <View style={styles.meter}>
        <View style={[styles.meterFill, { width: `${used}%` }]} />
      </View>
      <Txt size={12.5} color="rgba(255,255,255,0.9)">{f('boostRates', { a: money(a.rates.imp1000, lang), b: money(a.rates.click, lang) })}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 10, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  img: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#eef0ff' },
  rsn: { backgroundColor: colors.dangerBg, borderRadius: 10, padding: 10, gap: 2 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { flexBasis: '30%', flexGrow: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 8 },
  acts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  acc: { backgroundColor: colors.primary, borderRadius: 18, padding: 16, gap: 8 },
  accHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  accCell: { flexBasis: '45%', flexGrow: 1 },
  meter: { height: 8, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  meterFill: { height: '100%', backgroundColor: colors.orange },
});
