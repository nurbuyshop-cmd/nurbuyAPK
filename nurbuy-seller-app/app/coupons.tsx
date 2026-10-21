import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/api';
import { coupons as loadCoupons, deleteCoupon, saveCoupon, type Coupon, type CouponState } from '@/api/wallet';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Select } from '@/components/Select';
import { Sheet } from '@/components/Sheet';
import { Switch } from '@/components/Switch';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Chip, Empty, ErrorBox, Spinner, type ChipTone } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { errorText } from '@/lib/errors';
import { isMoney, isWhole, money, numText } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useLang } from '@/store/i18n';
import { useProducts } from '@/store/products';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

const CPS: Record<CouponState, [StringKey, ChipTone]> = {
  live: ['csLive', 'green'],
  inactive: ['csInactive', 'grey'],
  scheduled: ['csScheduled', 'purple'],
  expired: ['csExpired', 'red'],
  used_up: ['csUsedUp', 'amber'],
};

/** The seller's product coupons: list, create, edit, copy and delete (website scrCoupons()). */
export default function Coupons() {
  const { t, n, lang } = useLang();
  const { data, error, reload, setData } = useLoad('coupons', loadCoupons);
  const products = useProducts((s) => s.list);
  const [edit, setEdit] = useState<Coupon | 'new' | null>(null);
  const [del, setDel] = useState<Coupon | null>(null);
  const [delBusy, setDelBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!useProducts.getState().list) void useProducts.getState().load();
  }, []);

  const openNew = () => {
    const prods = (products ?? []).filter((p) => p.status !== 'rejected');
    if (!prods.length) toast(t('addProductFirst'), 'bad', 4500);
    else setEdit('new');
  };

  const disc = (c: Coupon) => (c.type === 'pct' ? `${n(c.value)}% ${t('off')}` : `${money(c.value, lang)} ${t('off')}`);

  const remove = async () => {
    if (!del) return;
    setDelBusy(true);
    try {
      setData(await deleteCoupon(del.id));
      toast(t('couponDeleted'), 'ok');
      setDel(null);
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setDelBusy(false);
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('coupons')} back backTo="/profile" right={<Button small icon="plus" label={t('newCoupon')} onPress={openNew} />} />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await reload();
                setRefreshing(false);
              }}
            />
          }
        >
          <Banner>{t('couponsInfo')}</Banner>
          {!data.length ? (
            <Empty icon="tag" title={t('noCoupons')} sub={t('noCouponsSub')}>
              <Button icon="plus" label={t('newCoupon')} onPress={openNew} style={styles.emptyBtn} />
            </Empty>
          ) : (
            data.map((c) => (
              <View key={c.id} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.code}>
                    <Txt weight="bold" size={15} latin color={colors.primary}>{c.code}</Txt>
                  </View>
                  <View style={styles.grow} />
                  <Chip label={t(CPS[c.state][0])} tone={CPS[c.state][1]} />
                </View>
                <Txt weight="bold" size={18} color={colors.orange}>{disc(c)}</Txt>
                <View style={styles.row}>
                  <Icon name="box" size={16} color={colors.grey} />
                  <Txt size={13.5} color={colors.grey} style={styles.grow}>{c.pname || '-'}</Txt>
                </View>
                <View style={styles.meta}>
                  {c.min_buy > 0 ? <Txt size={12.5} color={colors.grey}>{`${t('minPurchase')} ${money(c.min_buy, lang)}`}</Txt> : null}
                  <Txt size={12.5} color={colors.grey}>{`${t('used')} ${n(c.used)}${c.max_uses ? ` / ${n(c.max_uses)}` : ''}`}</Txt>
                  {c.per_user ? <Txt size={12.5} color={colors.grey}>{`${t('perCustomer')} ${n(c.per_user)}`}</Txt> : null}
                  <Txt size={12.5} color={colors.grey}>{`${c.starts ? n(c.starts) : t('now')} - ${c.ends ? n(c.ends) : t('noExpiry')}`}</Txt>
                </View>
                <View style={styles.acts}>
                  <Button small variant="secondary" icon="edit" label={t('edit')} onPress={() => setEdit(c)} style={styles.grow} />
                  <Button
                    small
                    variant="secondary"
                    icon="file"
                    label={t('copy')}
                    onPress={() => {
                      void Clipboard.setStringAsync(c.code).then(() => toast(t('codeCopied'), 'ok'));
                    }}
                    style={styles.grow}
                  />
                  <Pressable onPress={() => setDel(c)} style={styles.del} accessibilityRole="button" accessibilityLabel={t('delete')}>
                    <Icon name="trash" size={19} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {edit ? <CouponSheet c={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={setData} /> : null}
      {del ? (
        <Sheet title={t('deleteCouponQ')} sub={t('deleteCouponSub')} onClose={() => setDel(null)}>
          <Button label={t('deleteCoupon')} icon="trash" variant="dangerSolid" busy={delBusy} onPress={() => void remove()} />
          <Button label={t('cancel')} variant="ghost" onPress={() => setDel(null)} />
        </Sheet>
      ) : null}
    </View>
  );
}

function CouponSheet({ c, onClose, onSaved }: { c: Coupon | null; onClose: () => void; onSaved: (l: Coupon[]) => void }) {
  const { t, n } = useLang();
  const products = useProducts((s) => s.list);
  const prods = (products ?? []).filter((p) => p.status !== 'rejected');
  const [v, setV] = useState(() => ({
    product_id: c ? c.product_id : prods[0]?.id ?? 0,
    code: c?.code ?? '',
    type: c?.type ?? ('pct' as 'pct' | 'fixed'),
    value: c ? n(c.value) : '',
    min_buy: c && c.min_buy ? n(c.min_buy) : '',
    starts: c?.starts ?? '',
    ends: c?.ends ?? '',
    max_uses: c && c.max_uses ? n(c.max_uses) : '',
    per_user: c ? (c.per_user ? n(c.per_user) : '') : n(1),
    on: c ? c.status === 'active' : true,
  }));
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof v>(k: K, x: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: x }));
    if (err[k]) setErr((s) => ({ ...s, [k]: '' }));
  };

  const save = async () => {
    const body = {
      product_id: v.product_id,
      code: v.code.toUpperCase().replace(/\s/g, ''),
      type: v.type,
      value: numText(v.value),
      min_buy: numText(v.min_buy) || '0',
      starts: v.starts,
      ends: v.ends,
      max_uses: numText(v.max_uses) || '0',
      per_user: numText(v.per_user) || '0',
      status: v.on ? 'active' : 'inactive',
    };
    const e: Record<string, string> = {};
    if (!/^[A-Z0-9_-]{3,20}$/.test(body.code)) e.code = t('fCode');
    if (!isMoney(body.value) || Number(body.value) <= 0) e.value = t('fValue');
    else if (body.type === 'pct' && Number(body.value) > 90) e.value = t('fPct90');
    if (!isMoney(body.min_buy)) e.min_buy = t('fMinBuy');
    if (body.starts && body.ends && body.ends < body.starts) e.ends = t('fEnds');
    if (!isWhole(body.max_uses)) e.max_uses = t('fWhole');
    if (!isWhole(body.per_user)) e.per_user = t('fWhole');
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const list = await saveCoupon(c ? c.id : null, {
        ...body,
        value: Number(body.value),
        min_buy: Number(body.min_buy),
        max_uses: Number(body.max_uses),
        per_user: Number(body.per_user),
      });
      onSaved(list);
      toast(c ? t('couponSaved') : t('couponCreated'), 'ok');
      onClose();
    } catch (x) {
      setBusy(false);
      if (x instanceof ApiError && x.code === 'code_taken') setErr({ code: t('codeTaken') });
      else if (x instanceof ApiError && x.code === 'not_your_product') setErr({ product_id: t('notYourProduct') });
      else if (x instanceof ApiError && x.field && x.status === 400) setErr({ [x.field]: x.error });
      else toast(errorText(x, t), 'bad');
    }
  };

  return (
    <Sheet title={c ? t('editCoupon') : t('newCoupon')} onClose={onClose}>
      <Select
        label={t('product')}
        required
        value={v.product_id}
        options={prods.map((p) => ({ value: p.id, label: `${p.name}${p.status !== 'active' ? ` (${t('notLiveYet')})` : ''}` }))}
        onChange={(x) => set('product_id', x)}
        error={err.product_id}
      />
      <Field label={t('couponCode')} required value={v.code} onChangeText={(x) => set('code', x)} maxLength={20} placeholder="TOMATO20" autoCapitalize="characters" hint={t('couponCodeHint')} error={err.code} />
      <Txt weight="semibold" size={13.5} color="#333">
        {t('discType')}
        <Txt color={colors.danger}> *</Txt>
      </Txt>
      <View style={styles.radios}>
        {(['pct', 'fixed'] as const).map((k) => (
          <Pressable key={k} onPress={() => set('type', k)} style={[styles.rad, v.type === k && styles.radOn]} accessibilityRole="radio" accessibilityState={{ checked: v.type === k }}>
            <Txt weight="semibold" size={14} color={v.type === k ? colors.primary : colors.text}>{k === 'pct' ? t('pctType') : t('fixedType')}</Txt>
          </Pressable>
        ))}
      </View>
      <View style={styles.two}>
        <View style={styles.grow}>
          <Field label={t('discAmount')} required keyboardType="decimal-pad" value={v.value} onChangeText={(x) => set('value', x)} error={err.value} />
        </View>
        <View style={styles.grow}>
          <Field label={t('minBuy')} keyboardType="decimal-pad" placeholder={t('optional')} value={v.min_buy} onChangeText={(x) => set('min_buy', x)} error={err.min_buy} />
        </View>
      </View>
      <View style={styles.two}>
        <DateField label={t('startDate')} value={v.starts} onChange={(x) => set('starts', x)} error={err.starts} />
        <DateField label={t('expiryDate')} value={v.ends} onChange={(x) => set('ends', x)} error={err.ends} />
      </View>
      <View style={styles.two}>
        <View style={styles.grow}>
          <Field label={t('usageLimit')} keyboardType="number-pad" placeholder={t('noLimit')} value={v.max_uses} onChangeText={(x) => set('max_uses', x)} error={err.max_uses} />
        </View>
        <View style={styles.grow}>
          <Field label={t('perUserLimit')} keyboardType="number-pad" placeholder={t('noLimit')} value={v.per_user} onChangeText={(x) => set('per_user', x)} error={err.per_user} />
        </View>
      </View>
      <View style={styles.swRow}>
        <Txt weight="semibold" size={14.5} style={styles.grow}>{t('couponActive')}</Txt>
        <Switch value={v.on} label={t('couponActive')} onChange={(x) => set('on', x)} />
      </View>
      <Button label={c ? t('saveChanges') : t('createCoupon')} busy={busy} onPress={() => void save()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  grow: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 10, paddingBottom: 30 },
  emptyBtn: { marginTop: 14, alignSelf: 'stretch' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  code: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#f3f5ff' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 2 },
  acts: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  del: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.dangerBg, alignItems: 'center', justifyContent: 'center' },
  radios: { flexDirection: 'row', gap: 8, marginTop: -4 },
  rad: { flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#dfe3f1', alignItems: 'center', justifyContent: 'center' },
  radOn: { borderColor: colors.primary, backgroundColor: '#f3f5ff' },
  two: { flexDirection: 'row', gap: 10 },
  swRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
