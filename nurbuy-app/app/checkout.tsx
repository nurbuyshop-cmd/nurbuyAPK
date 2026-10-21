import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/api';
import { placeOrder, type OrderRequest } from '@/api/orders';
import { saveProfile } from '@/api/profile';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { SumLine } from '@/components/SumLine';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { track } from '@/lib/analytics';
import { cartItems, cartTotals } from '@/lib/cart';
import { useDelivery } from '@/lib/delivery';
import { errorText } from '@/lib/errors';
import { isStr } from '@/lib/guards';
import { money } from '@/lib/money';
import { isEmail, isMobile, normalizeMobile } from '@/lib/phone';
import { productName } from '@/lib/products';
import { useCouponDiscount } from '@/lib/useCoupon';
import { useIndex } from '@/lib/useIndex';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { fmt, useI18n, useT } from '@/store/i18n';
import { areaComplete, pinForOrder, placeText, selectedPlaces, useLocation } from '@/store/location';
import { requireLogin } from '@/store/loginGate';
import { colors, radius, shadow, TOUCH } from '@/theme';

type Pay = 'cod' | 'wallet';

export default function CheckoutScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const qc = useQueryClient();
  const idx = useIndex();
  const user = useAuth((s) => s.user);
  const profile = useAuth((s) => s.profile);
  const walletBal = useAuth((s) => s.walletBal);
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const settings = useCatalog((s) => s.catalog?.settings);
  const loc = useLocation();
  const d = useDelivery();

  const saved = useMemo(() => (Array.isArray(profile.addr) ? profile.addr.filter(isStr) : []), [profile.addr]);
  const [mobile, setMobile] = useState(user?.mobile ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [addrIdx, setAddrIdx] = useState<number>(saved.length ? 0 : -1);
  const [newAddr, setNewAddr] = useState(loc.line);
  const [keep, setKeep] = useState(true);
  const [pay, setPay] = useState<Pay>(settings?.cod === false ? 'wallet' : 'cod');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const items = useMemo(() => (idx ? cartItems(lines, idx).filter((i) => i.p) : []), [lines, idx]);
  const cpn = useCouponDiscount(coupon, items);
  const codFee = settings?.codFee ?? 0;
  const totals = cartTotals(items, { fee: d.fee, freeAbove: d.freeAbove, zoneFee: d.zonesMode && loc.quote ? loc.quote.fee : null, codFee, pay, disc: cpn.discount });

  useEffect(() => void track('checkout'), []);

  // the server prices the cart for the pinned place
  const sig = items.map((i) => `${i.line.id}:${i.line.q}`).join(',');
  useEffect(() => {
    if (d.zonesMode) void loc.requote(totals.sub, items.map((i) => ({ id: i.line.id, shop: i.shop })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.zonesMode, sig]);

  const places = selectedPlaces(loc.areas, loc.sel);
  const areaText = d.zonesMode && loc.pin ? loc.pin.full || placeText(places, lang) : placeText(places, lang);
  const areaOk = d.zonesMode ? !!loc.pin && !!loc.quote : areaComplete(loc.areas, loc.sel);
  const address = addrIdx >= 0 ? saved[addrIdx] ?? '' : newAddr.trim();
  const minOrder = d.zonesMode ? loc.quote?.minOrder ?? null : null;

  const submit = () => {
    setErr('');
    if (!items.length) return;
    if (settings?.maint) return setErr(t('errMaint'));
    if (!isMobile(mobile)) return setErr(t('vMobile'));
    if (email.trim() && !isEmail(email.trim())) return setErr(t('vEmailOpt'));
    if (!areaOk) return setErr(d.zonesMode ? (loc.pin ? t('errOutside') : t('errPin')) : t('errLoc'));
    if (!address) return setErr(t('vAddress'));
    if (minOrder !== null && totals.sub < minOrder) return setErr(fmt(t('minOrderNotMet'), { v: money(minOrder, lang) }, lang));
    if (pay === 'wallet' && walletBal < totals.total) return setErr(t('errWallet'));
    requireLogin(() => void send());
  };

  const send = async () => {
    setBusy(true);
    const body: OrderRequest = {
      view: 'min',
      items: items.map((i) => {
        const p = i.p!;
        const vl = i.v ? ` (${i.v.name})` : '';
        return {
          id: p.id,
          n: p.n + vl,
          bn: (p.bn || p.n) + vl,
          e: '',
          unit: i.unit,
          q: Math.min(i.line.q, i.max),
          shop: i.shop,
          ...(i.v ? { vid: i.v.id, variant: i.v.name } : {}),
        };
      }),
      fee: totals.fee,
      // a partial path would be refused (loc_incomplete); in zones mode the pin decides
      loc_id: areaComplete(loc.areas, loc.sel) ? places.at(-1)?.id ?? null : null,
      pay,
      name: user?.name ?? '',
      mobile: normalizeMobile(mobile),
      email: email.trim(),
      address: places.length ? `${address}, ${placeText(places, 'en')}` : address,
      shop: items[0]?.shop ?? '',
      ...(coupon && cpn.discount > 0 ? { coupon } : {}),
      extra: { loc: placeText(places, 'en'), cart: 1, ...(d.zonesMode && loc.pin ? { geo: pinForOrder(loc.pin) } : {}) },
    };
    try {
      const r = await placeOrder(body);
      useCart.getState().removeLines(items.map((i) => i.key));
      useCart.getState().setCoupon('');
      useAuth.setState({ walletBal: r.walletBal });
      if (addrIdx < 0 && keep && address && !saved.includes(address)) {
        const next = { ...useAuth.getState().profile, addr: [...saved, address.slice(0, 200)] };
        useAuth.setState({ profile: next });
        saveProfile(next).catch(() => {});
      }
      void qc.invalidateQueries({ queryKey: ['orders'] });
      router.replace({ pathname: '/order-success', params: { id: r.order.id, eta: String(r.order.eta?.mins ?? d.eta), bonus: String(r.cashback) } });
    } catch (e) {
      if (e instanceof ApiError && e.code === 'login_required') {
        requireLogin(() => void send());
      } else {
        setErr(errorText(e, t));
        if (e instanceof ApiError && e.code && ['price_changed', 'out_of_stock', 'max_qty', 'shop_closed', 'shop_no_delivery', 'item_unavailable'].includes(e.code)) {
          void useCatalog.getState().refresh();
        }
        if (e instanceof ApiError && e.code?.startsWith('coupon_')) useCart.getState().setCoupon('');
        if (e instanceof ApiError && e.code === 'insufficient_wallet') setPay('cod');
      }
    } finally {
      setBusy(false);
    }
  };

  const input = [styles.input, { fontFamily: font }];

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title={t('checkout')} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Txt weight="bold" size={16}>{t('contact')}</Txt>
          <Txt weight="bold" size={13} color="#333" style={styles.label}>{t('authMobile')}</Txt>
          <TextInput style={input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" placeholder="01XXXXXXXXX" placeholderTextColor="#9aa1b8" autoComplete="tel" />
          <Txt weight="bold" size={13} color="#333" style={styles.label}>{t('emailOpt')}</Txt>
          <TextInput style={input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="name@example.com" placeholderTextColor="#9aa1b8" autoComplete="email" />
        </View>

        <Pressable style={styles.card} onPress={() => router.push('/location')} accessibilityRole="button">
          <View style={styles.rowBetween}>
            <Txt weight="bold" size={16}>{t('deliveryArea')}</Txt>
            <Txt weight="bold" size={13.5} color={colors.primary}>{t('change')}</Txt>
          </View>
          <View style={styles.areaRow}>
            <Icon name="pin" size={20} color={areaOk ? colors.primary : colors.danger} />
            <Txt size={14} color={areaOk ? colors.text : colors.danger} style={styles.flex}>
              {areaOk ? areaText : d.zonesMode ? (loc.pin ? t('errOutside') : t('errPin')) : t('chooseArea')}
            </Txt>
          </View>
          {areaOk ? <Txt size={12.5} color={colors.grey}>{fmt(t('zoneInfo'), { fee: money(d.fee, lang), eta: d.eta }, lang)}</Txt> : null}
        </Pressable>

        <View style={styles.card}>
          <Txt weight="bold" size={16}>{t('deliveryAddress')}</Txt>
          {saved.length ? <Txt size={13} color={colors.grey}>{t('savedAddr')}</Txt> : null}
          {saved.map((a, i) => (
            <Radio key={a + i} on={addrIdx === i} onPress={() => setAddrIdx(i)} title={a} />
          ))}
          <Radio on={addrIdx === -1} onPress={() => setAddrIdx(-1)} title={t('newAddr')} />
          {addrIdx === -1 ? (
            <>
              <TextInput style={[input, styles.area]} value={newAddr} onChangeText={setNewAddr} placeholder={t('fullAddr')} placeholderTextColor="#9aa1b8" multiline maxLength={200} textAlignVertical="top" />
              <Pressable onPress={() => setKeep((v) => !v)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{ checked: keep }}>
                <View style={[styles.box, keep && styles.boxOn]}>{keep ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}</View>
                <Txt size={13.5} color="#444">{t('saveAddr')}</Txt>
              </Pressable>
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Txt weight="bold" size={16}>{t('paymentMethod')}</Txt>
          {settings?.cod !== false ? (
            <Radio on={pay === 'cod'} onPress={() => setPay('cod')} title={t('cod')} sub={fmt(t('codSub'), { v: money(codFee, lang) }, lang)} />
          ) : null}
          <Radio on={pay === 'wallet'} onPress={() => setPay('wallet')} title={t('walletPay')} sub={fmt(t('walletSub'), { v: money(walletBal, lang) }, lang)} />
          <Radio on={false} disabled onPress={() => {}} title={t('onlinePay')} sub={t('comingSoonShort')} />
        </View>

        <View style={styles.card}>
          <Txt weight="bold" size={16}>{t('orderSummary')}</Txt>
          {items.map((i) => (
            <View key={i.key} style={styles.item}>
              <Txt size={13.5} numberOfLines={2} style={styles.flex}>
                {productName(i.p!, lang) + (i.v ? ` (${i.v.name})` : '')}
              </Txt>
              <Txt size={13} color={colors.grey}>{`${money(i.unit, lang)} × ${fmt('{n}', { n: i.line.q }, lang)}`}</Txt>
            </View>
          ))}
          {totals.shops > 1 ? <Txt size={12.5} color="#8a5a00">{fmt(t('multiShop'), { n: d.eta }, lang)}</Txt> : null}
          <SumLine label={fmt(t('subtotalN'), { n: items.length }, lang)} value={money(totals.sub, lang)} />
          <SumLine label={t('deliveryFee')} value={totals.fee ? money(totals.fee, lang) : t('freeCaps')} green={!totals.fee} />
          {totals.disc ? <SumLine label={`${t('discount')} (${coupon})`} value={'− ' + money(totals.disc, lang)} green /> : null}
          {totals.cod ? <SumLine label={t('codCharge')} value={'+ ' + money(totals.cod, lang)} /> : null}
          <SumLine label={t('total')} value={money(totals.total, lang)} bold />
          <Txt size={12} color={colors.grey}>{t('inclVatLong')}</Txt>
        </View>
      </ScrollView>
      <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
        {err ? <Txt weight="semibold" size={13.5} color={colors.danger} accessibilityLiveRegion="polite">{err}</Txt> : null}
        <Button label={`${t('placeOrder')} · ${money(totals.total, lang)}`} onPress={submit} busy={busy} disabled={!items.length} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Radio({ on, title, sub, disabled, onPress }: { on: boolean; title: string; sub?: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.radio, on && styles.radioOn, disabled && styles.off]} accessibilityRole="radio" accessibilityState={{ selected: on, disabled }}>
      <View style={[styles.dot, on && styles.dotOn]} />
      <View style={styles.flex}>
        <Txt weight="semibold" size={14}>{title}</Txt>
        {sub ? <Txt size={12.5} color={colors.grey}>{sub}</Txt> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 10, gap: 10 },
  flex: { flex: 1, minWidth: 0 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 8, ...shadow.card },
  label: { marginTop: 4 },
  input: { minHeight: 48, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 12, fontSize: 15, color: colors.text, backgroundColor: '#fafbff' },
  area: { minHeight: 80, paddingTop: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: TOUCH + 8, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  radioOn: { borderColor: colors.primary, backgroundColor: '#f3f5ff' },
  off: { opacity: 0.5 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#b9c0d8' },
  dotOn: { borderColor: colors.primary, borderWidth: 6 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: TOUCH },
  box: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: '#b9c0d8', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  item: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, paddingHorizontal: 12, paddingTop: 10, gap: 8, borderTopWidth: 1, borderTopColor: colors.border },
});
