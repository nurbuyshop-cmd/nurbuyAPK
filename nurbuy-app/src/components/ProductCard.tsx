import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Product, Store } from '@/api/catalog';
import { useDelivery } from '@/lib/delivery';
import { thumb } from '@/lib/imageUrl';
import { money, money2 } from '@/lib/money';
import { hasPriceRange, productName, shopState, type Badge } from '@/lib/products';
import { openAtc } from '@/store/atcSheet';
import { useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { fmt, useI18n, useT } from '@/store/i18n';
import { liteOn, useLite } from '@/store/lite';
import { requireLogin } from '@/store/loginGate';
import { toast } from '@/store/toast';
import { isWished, useWishlist, wishKey } from '@/store/wishlist';
import { colors } from '@/theme';

import { BadgePill } from './BadgePill';
import { Icon } from './Icon';
import { ShopClosedText } from './ShopClosedText';
import { Stars } from './Stars';
import { Txt } from './Txt';

type Props = {
  p: Product;
  store: Store | undefined;
  badge: Badge | undefined;
  /** list photo width in px (screen-sized thumbnails) */
  imgWidth: number;
  style?: StyleProp<ViewStyle>;
  /** extra action on long press (wishlist: move to another list) */
  onLongPress?: () => void;
};

/** Phone product card: one photo, shop logo, heart, round add button, two-line title, rating, delivery line and price. */
function ProductCardImpl({ p, store, badge, imgWidth, style, onLongPress }: Props) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const rating = useCatalog((s) => s.ratings[p.id]);
  const inCart = useCart((s) => Object.values(s.lines).some((l) => l.id === p.id));
  const wished = useWishlist((s) => isWished(s, wishKey(p)));
  const { eta, fee, freeAbove } = useDelivery();
  const lite = useLite(liteOn);
  const st = shopState(store);
  const name = productName(p, lang);
  const disc = p.old > p.pr;
  const free = freeAbove !== null && p.pr >= freeAbove;

  const onHeart = () =>
    requireLogin(() => {
      const on = useWishlist.getState().toggle(p);
      toast(on ? t('wishAdded') : t('wishRemoved'));
    });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View style={styles.im}>
        <Image
          source={p.img ? thumb(p.img, imgWidth) : undefined}
          style={[styles.photo, !st.open && styles.grey]}
          contentFit="contain"
          transition={lite ? 0 : 120}
          recyclingKey={p.id}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.logo}>
          {store?.img ? (
            <Image source={thumb(store.img, 160)} style={styles.logoImg} contentFit="contain" />
          ) : (
            <Txt weight="bold" size={14} color={colors.primary}>{(p.sh.trim()[0] ?? 'N').toUpperCase()}</Txt>
          )}
        </View>
        <Pressable onPress={onHeart} style={styles.heart} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('wishlist')} accessibilityState={{ selected: wished }}>
          <Icon name={wished ? 'heartOn' : 'heart'} size={17} color={wished ? '#e5254b' : '#444'} strokeWidth={2.2} />
        </Pressable>
        {st.open ? (
          <>
            {badge ? <BadgePill badge={badge} style={styles.badge} /> : null}
            <Pressable
              onPress={() => openAtc(p.id)}
              style={[styles.add, inCart && styles.added]}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={t('addToCart')}
            >
              <Icon name={inCart ? 'check' : 'plus'} size={22} color={inCart ? colors.white : colors.primary} strokeWidth={2.4} />
            </Pressable>
          </>
        ) : (
          <View style={styles.closed}>
            <Txt weight="bold" size={13} color={colors.white}>{st.food ? t('restClosed') : t('closed')}</Txt>
            <ShopClosedText state={st} size={10.5} color="rgba(255,255,255,0.9)" />
          </View>
        )}
      </View>

      <Txt size={13} color={colors.grey} numberOfLines={1} style={styles.shop}>{p.sh}</Txt>
      <Txt weight="bold" size={15} numberOfLines={2} style={styles.title}>{name}</Txt>
      {rating && rating[1] > 0 ? (
        <View style={styles.rating}>
          <Stars value={rating[0]} size={13} />
          <Txt size={12.5} color="#1759e8">{fmt('{n}', { n: rating[1] }, lang)}</Txt>
        </View>
      ) : null}
      <View style={styles.meta}>
        <Icon name="clock" size={15} color={colors.grey} strokeWidth={1.7} />
        <Txt size={13} color={colors.grey} numberOfLines={1}>{fmt(t('minsN'), { n: eta }, lang)}</Txt>
        <Txt size={13} color={colors.grey}> • </Txt>
        <Icon name="scooter" size={15} color={colors.grey} strokeWidth={1.7} />
        <Txt size={13} color={colors.grey} numberOfLines={1}>{free ? t('free') : money(fee, lang)}</Txt>
      </View>
      <View style={styles.price}>
        {hasPriceRange(p) ? <Txt size={11} color="#777">{t('from')}</Txt> : null}
        <Txt weight="bold" size={17} style={disc ? styles.dc : undefined}>{money2(p.pr, lang)}</Txt>
        {disc ? <Txt size={13} color={colors.grey} style={styles.del}>{money2(p.old, lang)}</Txt> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 0 },
  pressed: { opacity: 0.85 },
  im: {
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  grey: { opacity: 0.55 },
  logo: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  logoImg: { width: '100%', height: '100%' },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  badge: { position: 'absolute', left: 8, bottom: 10, maxWidth: '62%' },
  add: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  added: { backgroundColor: '#12a150' },
  closed: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17,20,38,0.78)', paddingHorizontal: 8, paddingTop: 7, paddingBottom: 8 },
  shop: { marginTop: 10 },
  title: { marginTop: 3, marginBottom: 4, lineHeight: 19 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, overflow: 'hidden' },
  price: { flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 },
  dc: { backgroundColor: 'rgba(172,230,45,0.55)', paddingHorizontal: 2 },
  del: { textDecorationLine: 'line-through' },
});

export const ProductCard = memo(ProductCardImpl);
