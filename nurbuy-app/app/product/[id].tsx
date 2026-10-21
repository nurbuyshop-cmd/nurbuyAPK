import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Coupon, Product, Variant } from '@/api/catalog';
import { fetchReviews } from '@/api/reviews';
import { AutoSlider } from '@/components/AutoSlider';
import { BannerSlot } from '@/components/BannerSlot';
import { Button } from '@/components/Button';
import { CatalogState } from '@/components/CatalogState';
import { Icon, type IconName } from '@/components/Icon';
import { ProductRow } from '@/components/ProductRow';
import { RatingSummary, ReviewRow } from '@/components/ReviewParts';
import { ShopClosedText } from '@/components/ShopClosedText';
import { Stars } from '@/components/Stars';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { VariantPicker } from '@/components/VariantPicker';
import { track } from '@/lib/analytics';
import type { Placement } from '@/lib/banners';
import { shortDate } from '@/lib/dates';
import { related } from '@/lib/reco';
import { useRecent } from '@/lib/useRecent';
import { useDelivery } from '@/lib/delivery';
import { thumb } from '@/lib/imageUrl';
import { discountPct, money } from '@/lib/money';
import { categoryName, inStock, productName, shopState, type CatalogIndex } from '@/lib/products';
import { shareProduct } from '@/lib/share';
import { useIndex } from '@/lib/useIndex';
import { defaultVariant } from '@/lib/variants';
import { openAtc } from '@/store/atcSheet';
import { useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { useHistory } from '@/store/history';
import { usePersonal } from '@/store/personal';
import { digits, fmt, useI18n, useT } from '@/store/i18n';
import { requireLogin } from '@/store/loginGate';
import { toast } from '@/store/toast';
import { useViewer } from '@/store/viewer';
import { isWished, useWishlist, wishKey } from '@/store/wishlist';
import { colors, radius, shadow, TOUCH } from '@/theme';

const PRODUCT_SPOT: Placement[] = ['product'];
const photoKey = (u: string) => u;

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const idx = useIndex();
  const p = idx && id ? idx.byId.get(id) : undefined;

  if (!idx) {
    return (
      <View style={styles.page}>
        <TopBar title="" />
        <CatalogState />
      </View>
    );
  }
  if (!p) {
    return (
      <View style={styles.page}>
        <TopBar title="" />
        <Txt size={15} color={colors.grey} style={styles.gone}>{t('productGone')}</Txt>
      </View>
    );
  }
  return <ProductBody key={p.id} p={p} idx={idx} />;
}

function ProductBody({ p, idx }: { p: Product; idx: CatalogIndex }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const tabsY = useRef(0);
  const [tab, setTab] = useState<'rv' | 'ds'>('ds');
  const [v, setV] = useState<Variant | null>(() => (p.vr ? defaultVariant(p.vr) : null));
  const store = idx.storeByName.get(p.sh);
  const st = shopState(store);
  const rating = useCatalog((s) => s.ratings[p.id]);
  const siteName = useCatalog((s) => s.catalog?.settings.name ?? 'NurBuy');
  const wished = useWishlist((s) => isWished(s, wishKey(p)));
  const reviews = useQuery({ queryKey: ['reviews', p.id], queryFn: () => fetchReviews(p.id) });

  useEffect(() => {
    useHistory.getState().add(p.id);
    usePersonal.getState().remember(p.cid);
    void track('view', { p: p.id, pn: p.n, cat: p.cat });
  }, [p.id, p.cid, p.n, p.cat]);

  const unit = v ? v.price : p.pr;
  const old = v ? v.old : p.old;
  const off = discountPct(unit, old);
  const name = productName(p, lang);
  const imgs = useMemo(() => {
    const list = p.imgs.length ? p.imgs : p.img ? [p.img] : [];
    // a chosen option with its own photo shows that photo first
    return v?.img && !list.includes(v.img) ? [v.img, ...list] : list;
  }, [p, v]);
  const cat = idx.catById.get(p.cid);
  const about = lang === 'bn' ? p.aboutBn || p.about : p.about || p.aboutBn;
  const recent = useRecent();
  // the lower part (offers, details, reviews, related products) waits for the first frame of the page
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);
  const more = useMemo(() => (ready ? related(idx, p, recent) : []), [ready, idx, p, recent]);

  const goTab = (which: 'rv' | 'ds') => {
    setTab(which);
    scroll.current?.scrollTo({ y: tabsY.current - 60, animated: true });
  };

  const onHeart = () =>
    requireLogin(() => {
      const on = useWishlist.getState().toggle(p);
      toast(on ? t('wishAdded') : t('wishRemoved'));
    });

  const count = reviews.data?.count ?? rating?.[1] ?? 0;
  const avg = reviews.data?.count ? reviews.data.avg : rating?.[0] ?? 0;

  return (
    <View style={styles.page}>
      <TopBar
        title=""
        right={
          <View style={styles.actions}>
            <RoundBtn icon="search" label={t('searchProduct')} onPress={() => router.push('/search')} />
            <RoundBtn icon={wished ? 'heartOn' : 'heart'} color={wished ? '#e5254b' : colors.text} label={t('wishlist')} onPress={onHeart} />
            <RoundBtn icon="share" label={t('share')} onPress={() => void shareProduct(p, lang, siteName)} />
          </View>
        }
      />
      <ScrollView ref={scroll} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        <View style={styles.gallery}>
          {/* photos slide on their own every 3 seconds, smoothly and always forward; a swipe pauses it */}
          <AutoSlider
            key={imgs.join('|')}
            data={imgs}
            keyOf={photoKey}
            itemWidth={width}
            visible={1}
            interval={3000}
            dots
            renderItem={(u, n) => (
              <Pressable onPress={() => useViewer.getState().open(imgs, n)} accessibilityRole="imagebutton" accessibilityLabel={name}>
                <Image source={thumb(u, 960)} style={{ width, height: width }} contentFit="contain" transition={150} />
              </Pressable>
            )}
          />
        </View>

        <Pressable
          style={styles.shopRow}
          onPress={() => store && router.push({ pathname: '/shop/[id]', params: { id: store.id } })}
          accessibilityRole="link"
        >
          <View style={styles.shopLogo}>
            {store?.img ? <Image source={thumb(store.img, 160)} style={styles.full} contentFit="contain" /> : <Icon name="store" size={18} color={colors.primary} />}
          </View>
          <Txt weight="bold" size={15} numberOfLines={1} style={styles.flex}>{p.sh}</Txt>
          <Txt weight="semibold" size={13.5} color={colors.primary}>{t('visitShop') + ' ›'}</Txt>
        </Pressable>

        <View style={styles.card}>
          <Txt weight="bold" size={19} style={styles.title}>{name}</Txt>
          <View style={styles.meta}>
            {p.ts > 0 ? <Txt size={12.5} color={colors.grey}>{t('addedOn') + ' ' + shortDate(p.ts, lang)}</Txt> : null}
            {p.pcode ? (
              <Txt size={12.5} color={colors.grey}>
                {t('productId') + ': '}
                <Txt weight="bold" size={12.5} color={colors.grey}>{p.pcode}</Txt>
              </Txt>
            ) : null}
          </View>
          <View style={styles.priceRow}>
            <Txt weight="bold" size={24}>{money(unit, lang)}</Txt>
            {off ? <Txt size={15} color={colors.grey} style={styles.del}>{money(old, lang)}</Txt> : null}
            {off ? <Txt weight="bold" size={14} color={colors.orange}>{fmt(t('offPct'), { n: off }, lang)}</Txt> : null}
            <Txt size={12} color={colors.grey}>{t('inclVat')}</Txt>
          </View>

          {count > 0 ? (
            <Pressable style={styles.rateRow} onPress={() => goTab('rv')} accessibilityRole="button">
              <Stars value={avg} size={15} />
              <Txt weight="bold" size={14}>{digits(avg.toFixed(1), lang)}</Txt>
              <Txt size={13} color={colors.grey}>{`(${digits(count, lang)} ${t('ratings')})`}</Txt>
              <Txt weight="semibold" size={13} color={colors.primary}>{t('viewAllShort') + ' ›'}</Txt>
            </Pressable>
          ) : (
            <Txt size={13} color={colors.grey} style={styles.rateRow}>{t('noRatings')}</Txt>
          )}
          <Pressable onPress={() => goTab('ds')} style={styles.descLink} accessibilityRole="button">
            <Txt weight="semibold" size={13.5} color={colors.primary} style={styles.underline}>{t('viewDesc')}</Txt>
          </Pressable>

          {p.vr && v ? <View style={styles.vr}><VariantPicker vr={p.vr} value={v} onChange={setV} /></View> : null}

          {!st.open ? (
            <View style={styles.closed}>
              <Icon name="clock" size={18} color={colors.danger} />
              <View style={styles.flex}>
                <Txt weight="bold" size={14} color={colors.danger}>{st.food ? t('restClosed') : t('closed')}</Txt>
                <ShopClosedText state={st} size={12.5} color={colors.danger} />
              </View>
            </View>
          ) : null}

          <InfoTicker p={p} v={v} unit={unit} off={off} />
        </View>

        {/* the rest is drawn right after the page appears, so opening a product feels instant on weak phones */}
        {!ready ? null : (
        <>
        <View style={styles.bannerPad}>
          <BannerSlot placements={PRODUCT_SPOT} />
        </View>

        {p.cpn.length ? <Coupons p={p} /> : null}

        <DeliveryCard shop={p.sh} />

        <View style={styles.card}>
          <Txt weight="bold" size={16} style={styles.h}>{t('specifications')}</Txt>
          <Spec k={t('soldBy')} v={p.sh} />
          {p.pcode ? <Spec k={t('productId')} v={p.pcode} /> : null}
          {p.ts > 0 ? <Spec k={t('addedOn')} v={shortDate(p.ts, lang)} /> : null}
          {cat || p.cat ? <Spec k={t('category')} v={(cat ? categoryName(cat, lang) : p.cat) + (p.sub ? ' / ' + p.sub : '')} /> : null}
          {p.specs.map(([k, x]) => <Spec key={k + x} k={k} v={x} />)}
        </View>

        <View style={styles.card} onLayout={(e) => (tabsY.current = e.nativeEvent.layout.y)}>
          <View style={styles.tabs} accessibilityRole="tablist">
            {(['rv', 'ds'] as const).map((k) => (
              <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabOn]} accessibilityRole="tab" accessibilityState={{ selected: tab === k }}>
                <Txt weight="bold" size={14} color={tab === k ? colors.primary : colors.grey}>{k === 'rv' ? t('ratingsReviews') : t('description')}</Txt>
              </Pressable>
            ))}
          </View>
          {tab === 'ds' ? (
            <Txt size={14.5} color="#333" style={styles.about}>{about || '—'}</Txt>
          ) : reviews.data && reviews.data.count > 0 ? (
            <View>
              <RatingSummary rv={reviews.data} />
              <View style={styles.revList}>{reviews.data.list.slice(0, 3).map((r, i) => <ReviewRow key={i} r={r} />)}</View>
              <Button
                label={`${t('viewAllReviews')} (${digits(reviews.data.count, lang)}) ›`}
                variant="outline"
                onPress={() => router.push({ pathname: '/reviews/[id]', params: { id: p.id } })}
              />
            </View>
          ) : (
            <View style={styles.noRv}>
              <Txt size={14} color="#8a8f9c">{t('noReviews')}</Txt>
              {reviews.data?.can ? (
                <Button label={t('reviewThis')} variant="outline" onPress={() => router.push({ pathname: '/reviews/[id]', params: { id: p.id } })} />
              ) : null}
            </View>
          )}
        </View>

        {more.length ? (
          <>
            <Txt weight="bold" size={17} style={styles.moreH}>{t('related')}</Txt>
            <ProductRow items={more} index={idx} />
          </>
        ) : null}
        </>
        )}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 10 }]}>
        <Button
          label={t('buyNow')}
          variant="outline"
          disabled={!st.open || !inStock(p, v)}
          onPress={() => openAtc(p.id, 'buy', v?.id ?? null)}
          style={styles.flex}
        />
        <Button
          label={inStock(p, v) ? t('addToCartBtn') : t('outOfStock')}
          disabled={!st.open || !inStock(p, v)}
          onPress={() => openAtc(p.id, 'cart', v?.id ?? null)}
          style={styles.flex}
        />
      </View>
    </View>
  );
}

function RoundBtn({ icon, label, color = colors.text, onPress }: { icon: IconName; label: string; color?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.round} accessibilityRole="button" accessibilityLabel={label}>
      <Icon name={icon} size={20} color={color} strokeWidth={2} />
    </Pressable>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.spec}>
      <Txt size={13.5} color={colors.grey} style={styles.specK}>{k}</Txt>
      <Txt weight="semibold" size={13.5} style={styles.flex}>{v}</Txt>
    </View>
  );
}

/** The line inside the "Free Delivery" box that changes every 2 seconds: free delivery, discount, stock left, delivery minutes. */
function InfoTicker({ p, v, unit, off }: { p: Product; v: Variant | null; unit: number; off: number }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { eta, freeAbove } = useDelivery();
  const [i, setI] = useState(0);
  const lines: string[] = [];
  if (freeAbove !== null) lines.push(unit >= freeAbove ? t('freeDelivery') : fmt(t('freeOver'), { n: freeAbove }, lang));
  if (off > 0) lines.push(fmt(t('offPct'), { n: off }, lang));
  const stock = v ? v.stock : p.stockOn ? p.st : 0;
  if (stock > 0 && p.stockOn) lines.push(fmt(t('leftInStock'), { n: stock }, lang));
  if (eta > 0) lines.push(fmt(t('deliveryIn'), { n: eta }, lang));

  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), 2000);
    return () => clearInterval(id);
  }, []);

  if (!lines.length) return null;
  return (
    <View style={styles.ticker} accessibilityLiveRegion="none">
      <Icon name="truck" size={20} color={colors.primary} />
      <Txt weight="semibold" size={14} color={colors.primary}>{lines[i % lines.length]}</Txt>
    </View>
  );
}

function Coupons({ p }: { p: Product }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const chosen = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const label = (c: Coupon) => (c.type === 'pct' ? fmt(t('offPct'), { n: c.value }, lang) : fmt(t('offAmt'), { v: money(c.value, lang) }, lang));
  const sub = (c: Coupon) =>
    [c.min > 0 ? t('minBuy') + money(c.min, lang) : '', c.end ? t('validTill') + shortDate(Date.parse(c.end + 'T00:00:00+06:00'), lang) : '']
      .filter(Boolean)
      .join(' · ');
  return (
    <View style={styles.card}>
      <Txt weight="bold" size={16} style={styles.h}>{t('coupons')}</Txt>
      {p.cpn.map((c) => {
        const on = chosen === c.code;
        return (
          <View key={c.code} style={styles.cpn}>
            <Icon name="ticket" size={22} color={colors.orange} />
            <View style={styles.flex}>
              <Txt weight="bold" size={14}>{label(c)}</Txt>
              {sub(c) ? <Txt size={12} color={colors.grey}>{sub(c)}</Txt> : null}
            </View>
            <Pressable
              onPress={() => {
                void Clipboard.setStringAsync(c.code);
                toast(t('codeCopied') + c.code);
              }}
              style={styles.code}
              accessibilityRole="button"
            >
              <Txt weight="bold" size={12.5}>{c.code}</Txt>
              <Icon name="copy" size={14} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => {
                setCoupon(on ? '' : c.code);
                if (!on) toast(t('couponSaved'));
              }}
              style={[styles.apply, on && styles.applied]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Txt weight="bold" size={12.5} color={on ? colors.white : colors.primary}>{on ? t('applied') : t('apply')}</Txt>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function DeliveryCard({ shop }: { shop: string }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { eta } = useDelivery();
  return (
    <View style={styles.card}>
      <Txt weight="bold" size={16} style={styles.h}>{t('deliveryInfo')}</Txt>
      <View style={styles.dRow}>
        <View style={styles.dIc}><Icon name="clock" size={18} color={colors.primary} /></View>
        <View>
          <Txt size={12} color={colors.grey}>{t('deliveryTime')}</Txt>
          <Txt weight="bold" size={14}>{fmt(t('minutesN'), { n: eta }, lang)}</Txt>
        </View>
      </View>
      <View style={styles.dRow}>
        <View style={styles.dIc}><Icon name="store" size={18} color={colors.primary} /></View>
        <View>
          <Txt size={12} color={colors.grey}>{t('soldBy')}</Txt>
          <Txt weight="bold" size={14}>{shop}</Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  gone: { textAlign: 'center', padding: 32 },
  bannerPad: { marginHorizontal: 12, marginTop: 10 },
  flex: { flex: 1, minWidth: 0 },
  full: { width: '100%', height: '100%' },
  actions: { flexDirection: 'row', gap: 6 },
  round: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  gallery: { backgroundColor: colors.white },
  dots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(29,47,224,0.3)' },
  dotOn: { width: 18, backgroundColor: colors.primary },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, marginTop: 8, paddingHorizontal: 14, minHeight: 54 },
  shopLogo: { width: 34, height: 34, borderRadius: 9, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginHorizontal: 12, marginTop: 10, ...shadow.card },
  title: { lineHeight: 26 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, marginTop: 4 },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, minHeight: 32 },
  descLink: { alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  del: { textDecorationLine: 'line-through' },
  vr: { marginTop: 14 },
  closed: { flexDirection: 'row', gap: 8, backgroundColor: colors.dangerBg, borderRadius: 12, padding: 12, marginTop: 14 },
  ticker: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, borderWidth: 1, borderColor: '#dbe3ff', backgroundColor: '#eef2ff', borderRadius: 12, paddingHorizontal: 12, minHeight: 44 },
  h: { marginBottom: 10 },
  spec: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  specK: { width: '38%' },
  cpn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  code: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.grey, borderRadius: 8, paddingHorizontal: 8, minHeight: 34 },
  apply: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, minHeight: 34, justifyContent: 'center' },
  applied: { backgroundColor: colors.primary },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  dIc: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: TOUCH, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  about: { lineHeight: 23 },
  revList: { marginVertical: 10 },
  noRv: { gap: 12, paddingVertical: 6 },
  moreH: { marginHorizontal: 14, marginTop: 20, marginBottom: 8 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
  },
});
