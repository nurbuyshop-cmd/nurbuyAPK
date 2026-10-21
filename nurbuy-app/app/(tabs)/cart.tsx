import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CartRow } from '@/components/CartRow';
import { Icon } from '@/components/Icon';
import { ShopClosedText } from '@/components/ShopClosedText';
import { SumLine } from '@/components/SumLine';
import { Txt, useInputFont } from '@/components/Txt';
import { cartItems, cartTotals, type CartItem } from '@/lib/cart';
import { useDelivery } from '@/lib/delivery';
import { errorText } from '@/lib/errors';
import { money } from '@/lib/money';
import { shopState } from '@/lib/products';
import { useCouponDiscount } from '@/lib/useCoupon';
import { useIndex } from '@/lib/useIndex';
import { useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { fmt, useI18n, useT } from '@/store/i18n';
import { placeText, selectedPlaces, useLocation } from '@/store/location';
import { requireLogin } from '@/store/loginGate';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

export default function CartScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const idx = useIndex();
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const d = useDelivery();
  const quote = useLocation((s) => s.quote);
  const codFee = useCatalog((s) => s.catalog?.settings.codFee ?? 0);
  const [code, setCode] = useState(coupon);

  const items = useMemo(() => (idx ? cartItems(lines, idx) : []), [lines, idx]);
  const cpn = useCouponDiscount(coupon, items);
  const totals = cartTotals(items, { fee: d.fee, freeAbove: d.freeAbove, zoneFee: d.zonesMode && quote ? quote.fee : null, codFee, pay: 'cod', disc: cpn.discount });

  // zones mode: the server prices this cart for the pinned place (per-shop and distance charges)
  const sig = items.map((i) => `${i.line.id}:${i.line.q}`).join(',');
  useEffect(() => {
    if (!d.zonesMode || !items.length) return;
    void useLocation.getState().requote(totals.sub, items.filter((i) => i.p).map((i) => ({ id: i.line.id, shop: i.shop })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.zonesMode, sig]);

  const groups = useMemo(() => {
    const m = new Map<string, CartItem[]>();
    items.forEach((i) => m.set(i.shop, [...(m.get(i.shop) ?? []), i]));
    return [...m.entries()];
  }, [items]);

  const chips = useMemo(() => {
    const seen = new Set<string>();
    return items.flatMap((i) => i.p?.cpn ?? []).filter((c) => (seen.has(c.code) ? false : (seen.add(c.code), true))).slice(0, 6);
  }, [items]);

  const applyCode = (c: string) => {
    const v = c.trim().toUpperCase();
    setCode(v);
    setCoupon(v);
  };

  const checkout = () =>
    requireLogin(() => {
      if (items.some((i) => i.outOfStock)) return toast(t('removeOos'));
      const shut = items.find((i) => i.closed);
      if (shut) return toast(fmt(t('shopClosedCart'), { s: shut.shop }, lang));
      const over = items.find((i) => i.line.q > i.max);
      if (over) return toast(fmt(t('maxPerOrder'), { n: over.max }, lang));
      router.push('/checkout');
    });

  if (!items.length) {
    return (
      <View style={[styles.page, { paddingTop: insets.top }]}>
        <Head count={0} />
        <View style={styles.empty}>
          <Icon name="cart" size={56} color={colors.grey} />
          <Txt weight="bold" size={18}>{t('cartEmpty')}</Txt>
          <Txt size={14} color={colors.grey}>{t('cartEmptySub')}</Txt>
          <Button label={t('startShopping')} onPress={() => router.navigate('/')} style={styles.start} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <Head count={items.length} />
      <ScrollView contentContainerStyle={styles.content}>
        <DeliveryBanner eta={d.eta} />
        {d.freeAbove !== null ? (
          <View style={styles.box}>
            <Txt size={13.5} color="#333">
              {totals.left > 0 ? fmt(t('addMoreFree'), { v: money(totals.left, lang) }, lang) : t('youGetFree')}
            </Txt>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(100, Math.round((totals.sub * 100) / Math.max(1, d.freeAbove)))}%` }]} />
            </View>
          </View>
        ) : null}
        {totals.shops > 1 ? (
          <View style={[styles.box, styles.note]}>
            <Icon name="clock" size={18} color="#8a5a00" />
            <Txt size={13} color="#8a5a00" style={styles.flex}>{fmt(t('multiShop'), { n: d.eta }, lang)}</Txt>
          </View>
        ) : null}

        {groups.map(([shop, list]) => {
          const st = shopState(list[0]?.store);
          return (
            <View key={shop} style={styles.group}>
              <View style={styles.groupHead}>
                <View style={styles.av}>
                  <Txt weight="bold" size={14} color={colors.white}>{(shop.trim()[0] ?? '?').toUpperCase()}</Txt>
                </View>
                <Txt weight="bold" size={15} numberOfLines={1} style={styles.flex}>{shop}</Txt>
                {st.open ? (
                  <View style={styles.tag}>
                    <Icon name="bolt" size={12} color="#8a5a00" />
                    <Txt weight="bold" size={12} color="#8a5a00">{fmt(t('minsN'), { n: d.eta }, lang)}</Txt>
                  </View>
                ) : (
                  <View style={styles.closedTag}>
                    <Txt weight="bold" size={12} color={colors.danger}>{st.food ? t('restClosed') : t('closed')}</Txt>
                    <ShopClosedText state={st} size={11} color={colors.danger} />
                  </View>
                )}
              </View>
              {list.map((it) => <CartRow key={it.key} it={it} />)}
            </View>
          );
        })}

        <View style={styles.box}>
          <Txt weight="bold" size={16}>{t('orderSummary')}</Txt>
          <View style={styles.cpnRow}>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder={t('couponCode')}
              placeholderTextColor="#9aa1b8"
              autoCapitalize="characters"
              style={[styles.cpnInput, { fontFamily: font }]}
            />
            <Pressable onPress={() => applyCode(code)} style={styles.apply} accessibilityRole="button">
              <Txt weight="bold" size={14} color={colors.white}>{t('apply')}</Txt>
            </Pressable>
          </View>
          {chips.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {chips.map((c) => (
                <Pressable key={c.code} onPress={() => applyCode(c.code)} style={[styles.chip, coupon === c.code && styles.chipOn]} accessibilityRole="button">
                  <Txt weight="bold" size={12.5} color={coupon === c.code ? colors.white : colors.primary}>{c.code}</Txt>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          {coupon && cpn.error ? <Txt size={13} color={colors.danger}>{errorText(cpn.error, t)}</Txt> : null}
          {coupon && cpn.discount > 0 ? <Txt size={13} color="#12a150">{t('couponApplied')}</Txt> : null}
          <SumLine label={fmt(t('subtotalN'), { n: items.length }, lang)} value={money(totals.sub, lang)} />
          <SumLine label={t('deliveryFee')} value={totals.fee ? money(totals.fee, lang) : t('freeCaps')} green={!totals.fee} />
          {totals.disc ? <SumLine label={`${t('discount')} (${coupon})`} value={'− ' + money(totals.disc, lang)} green /> : null}
          <View style={styles.totalRow}>
            <Txt weight="bold" size={17}>{t('total')}</Txt>
            <Txt weight="bold" size={17}>{money(totals.total, lang)}</Txt>
          </View>
          <Txt size={12} color={colors.grey}>{t('inclVatLong')}</Txt>
        </View>
      </ScrollView>
      <View style={styles.bar}>
        <View>
          <Txt size={12} color={colors.grey}>{t('total')}</Txt>
          <Txt weight="bold" size={18}>{money(totals.total, lang)}</Txt>
        </View>
        <Button label={`${t('checkout')} (${fmt('{n}', { n: items.length }, lang)})`} onPress={checkout} style={styles.flex} />
      </View>
    </View>
  );
}

function Head({ count }: { count: number }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  return (
    <View style={styles.head}>
      <Txt weight="bold" size={20} style={styles.flex}>
        {t('myCart')}
        {count ? <Txt size={20} color="#8a8d99">{` (${fmt('{n}', { n: count }, lang)})`}</Txt> : null}
      </Txt>
      <View style={styles.mode}>
        <Icon name="bolt" size={13} color="#8a5a00" />
        <Txt weight="bold" size={12.5} color="#8a5a00">Minutes</Txt>
      </View>
    </View>
  );
}

function DeliveryBanner({ eta }: { eta: number }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const zonesMode = useLocation((s) => !!s.zones?.active);
  const pin = useLocation((s) => s.pin);
  const areas = useLocation((s) => s.areas);
  const sel = useLocation((s) => s.sel);
  const where = zonesMode && pin ? pin.area || pin.city || pin.full || '' : placeText(selectedPlaces(areas, sel).slice(-2), lang);
  return (
    <Pressable style={styles.banner} onPress={() => router.push('/location')} accessibilityRole="button">
      <View style={styles.bi}>
        <Icon name="bolt" size={22} color="#2a1d00" />
      </View>
      <View style={styles.flex}>
        <Txt weight="bold" size={15.5} color="#2a1d00">{fmt(t('deliveryIn'), { n: eta }, lang)}</Txt>
        <Txt size={12.5} color="#2a1d00" numberOfLines={1}>{t('deliveringTo') + (where || t('chooseArea'))}</Txt>
      </View>
      <Icon name="chevron" size={18} color="#2a1d00" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 12, ...shadow.card },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff3c4', borderRadius: 13, paddingHorizontal: 10, paddingVertical: 4 },
  content: { padding: 10, paddingBottom: 110, gap: 10 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, backgroundColor: '#ffcf33' },
  bi: { width: 42, height: 42, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  box: { backgroundColor: colors.white, borderRadius: 14, padding: 14, gap: 8 },
  note: { flexDirection: 'row', backgroundColor: '#fff8e1' },
  track: { height: 7, backgroundColor: '#eceef4', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#12a150', borderRadius: 4 },
  group: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12 },
  av: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#1759e8', alignItems: 'center', justifyContent: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fff3c4', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  closedTag: { alignItems: 'flex-end' },
  cpnRow: { flexDirection: 'row', gap: 8 },
  cpnInput: { flex: 1, height: 46, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, paddingHorizontal: 12, fontSize: 15, color: colors.text },
  apply: { minWidth: 84, height: 46, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: 8 },
  chip: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, minHeight: 36, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary, borderStyle: 'solid' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 4 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  start: { alignSelf: 'stretch', marginTop: 10 },
});
