import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Product, Variant } from '@/api/catalog';
import { track } from '@/lib/analytics';
import { thumb } from '@/lib/imageUrl';
import { money } from '@/lib/money';
import { inStock, productName, qtyLimit, shopState } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { defaultVariant } from '@/lib/variants';
import { useAtcSheet } from '@/store/atcSheet';
import { useCart } from '@/store/cart';
import { fmt, useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { QtyStepper } from './QtyStepper';
import { ShopClosedText } from './ShopClosedText';
import { Txt } from './Txt';
import { VariantPicker } from './VariantPicker';

/** Bottom sheet to choose the option and quantity before adding to the cart (full product title shown here). */
export function AddToCartSheet() {
  const productId = useAtcSheet((s) => s.productId);
  const close = useAtcSheet((s) => s.close);
  const idx = useIndex();
  const p = productId && idx ? idx.byId.get(productId) : undefined;
  return (
    <Modal visible={!!p} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={close} />
      {p ? <SheetBody key={p.id} p={p} /> : null}
    </Modal>
  );
}

function SheetBody({ p }: { p: Product }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const { mode, vid, close } = useAtcSheet();
  const idx = useIndex();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const [v, setV] = useState<Variant | null>(() => (p.vr ? p.vr.list.find((x) => x.id === vid) ?? defaultVariant(p.vr) : null));
  const existing = lines[`${p.id}|${v?.id ?? ''}`]?.q;
  const [want, setQ] = useState(existing ?? 1);
  const max = qtyLimit(p, v);
  // a different option can have a lower stock limit
  const q = Math.min(want, max);
  const store = idx?.storeByName.get(p.sh);
  const st = shopState(store);
  const ok = inStock(p, v) && st.open;
  const unit = v ? v.price : p.pr;
  const old = v ? v.old : p.old;
  const img = (v?.img || p.img) ?? '';

  const add = () => {
    setQty(p.id, v?.id ?? '', q);
    void track(mode === 'buy' ? 'checkout' : 'cart', { p: p.id });
    close();
    toast(t('addedToCart'));
    if (mode === 'buy') router.navigate('/cart');
  };

  return (
    <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.grab} />
      <Pressable onPress={close} style={styles.x} accessibilityRole="button" accessibilityLabel={t('close')}>
        <Icon name="x" size={20} color="#444" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Image source={img ? thumb(img, 320) : undefined} style={styles.img} contentFit="contain" />
          <View style={styles.flex}>
            <Txt weight="bold" size={15} style={styles.title}>{productName(p, lang)}</Txt>
            <View style={styles.price}>
              <Txt weight="bold" size={19} color={colors.primary}>{money(unit, lang)}</Txt>
              {old > unit ? <Txt size={13} color={colors.grey} style={styles.del}>{money(old, lang)}</Txt> : null}
            </View>
          </View>
        </View>

        {p.vr && v ? <VariantPicker vr={p.vr} value={v} onChange={setV} /> : null}

        {!st.open ? (
          <View style={styles.closed}>
            <Icon name="clock" size={18} color={colors.danger} />
            <View style={styles.flex}>
              <Txt weight="bold" size={14} color={colors.danger}>{st.food ? t('restClosed') : t('closed')}</Txt>
              <ShopClosedText state={st} size={12.5} color={colors.danger} />
            </View>
          </View>
        ) : null}

        <View style={styles.qtyRow}>
          <Txt weight="semibold" size={15}>{t('quantity')}</Txt>
          <QtyStepper value={q} max={max} onChange={setQ} onLimit={() => toast(fmt(t('maxQty'), { n: max }, lang))} />
        </View>
        <View style={styles.qtyRow}>
          <Txt weight="semibold" size={15}>{t('total')}</Txt>
          <Txt weight="bold" size={18}>{money(unit * q, lang)}</Txt>
        </View>
      </ScrollView>
      <Button
        label={!inStock(p, v) ? t('outOfStock') : mode === 'buy' ? t('buyNow') : t('addToCartBtn')}
        onPress={add}
        disabled={!ok}
        style={styles.go}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 18, paddingTop: 10, maxHeight: '88%' },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#dfe3f1', marginBottom: 8 },
  x: { position: 'absolute', right: 8, top: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  body: { gap: 16, paddingBottom: 12 },
  head: { flexDirection: 'row', gap: 12, paddingRight: 36 },
  img: { width: 88, height: 88, borderRadius: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  flex: { flex: 1, minWidth: 0 },
  title: { lineHeight: 20 },
  price: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  del: { textDecorationLine: 'line-through' },
  closed: { flexDirection: 'row', gap: 8, backgroundColor: colors.dangerBg, borderRadius: 12, padding: 12 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  go: { marginTop: 4 },
});
