import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';

import type { Product } from '@/api/catalog';
import { BannerSlot } from '@/components/BannerSlot';
import { CatalogState } from '@/components/CatalogState';
import { CategoryCircles } from '@/components/CategoryCircles';
import { HistoryRow } from '@/components/HistoryRow';
import { HomeHeader } from '@/components/HomeHeader';
import { ProductRow } from '@/components/ProductRow';
import { SectionHeader } from '@/components/SectionHeader';
import { ShopsRow } from '@/components/ShopsRow';
import { SponsoredRow } from '@/components/SponsoredRow';
import { Txt } from '@/components/Txt';
import type { Placement } from '@/lib/banners';
import { useDelivery } from '@/lib/delivery';
import { useBanners } from '@/lib/useBanners';
import { useIndex } from '@/lib/useIndex';
import { useCatalog } from '@/store/catalog';
import { useHistory } from '@/store/history';
import { fmt, useI18n, useT } from '@/store/i18n';
import { personalise, usePersonal } from '@/store/personal';
import { personalised, recommended, seenOf } from '@/lib/reco';
import { useRecent } from '@/lib/useRecent';
import { colors } from '@/theme';

const ROW_MAX = 12;
const TOP: Placement[] = ['top_min'];
const HERO: Placement[] = ['home', 'home_min'];

export default function HomeScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const idx = useIndex();
  const cats = useCatalog((s) => s.catalog?.cats);
  const stores = idx?.stores;
  const historyIds = useHistory((s) => s.ids);
  const clearHistory = useHistory((s) => s.clear);
  const { eta } = useDelivery();
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(() => new Animated.Value(0));
  const [onScroll] = useState(() => Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true }));
  const [headerH, setHeaderH] = useState(0);
  const lastCat = usePersonal((s) => s.lastCat);
  const topBanner = useBanners(TOP).list.length > 0;

  const history = useMemo(
    () => (idx ? historyIds.map((id) => idx.byId.get(id)).filter((p): p is Product => !!p) : []),
    [idx, historyIds],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    const c = useCatalog.getState();
    await Promise.all([c.refresh(), c.refreshRatings()]);
    setRefreshing(false);
  };

  // suggestions follow the last two products opened (same scoring as the website), only with tracking consent
  const recent = useRecent();
  const seen = useMemo(() => recent.map(seenOf), [recent]);
  const hot = useMemo(() => (idx ? personalised(idx.hot, seen).slice(0, ROW_MAX) : []), [idx, seen]);
  const best = useMemo(() => (idx ? personalised(idx.best, seen).slice(0, ROW_MAX) : []), [idx, seen]);
  const suggested = useMemo(() => (idx ? recommended(idx, recent) : []), [idx, recent]);
  const newest = useMemo(() => (idx ? personalise(idx.newest, lastCat) : []), [idx, lastCat]);

  const openList = (src: 'hot' | 'best' | 'new') => router.push({ pathname: '/products', params: { src } });

  return (
    <View style={styles.page}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        // the header follows the scroll on the animation thread (no JS work per frame)
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerH }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} progressViewOffset={headerH} />}>
        {!idx ? (
          <CatalogState />
        ) : (
          <>
            <View style={styles.pad}>
              {/* a "top_min" banner replaces the delivery-time strip, like the website */}
              {topBanner ? (
                <BannerSlot placements={TOP} style={styles.top} rounded={false} />
              ) : (
                <View style={styles.strip}>
                  <Txt weight="semibold" size={13} color={colors.primary} style={styles.center}>{fmt(t('stripEta'), { n: eta }, lang)}</Txt>
                </View>
              )}
              <BannerSlot placements={HERO} style={styles.hero} />
              {cats?.length ? <CategoryCircles cats={cats} /> : null}
            </View>
            <SponsoredRow />
            <View style={styles.gap} />

            {hot.length ? (
              <>
                <View style={styles.pad}>
                  <SectionHeader title={t('hotDeals')} icon="flame" action={{ label: t('viewAll'), onPress: () => openList('hot') }} />
                </View>
                <ProductRow items={hot} index={idx} />
              </>
            ) : null}

            {best.length ? (
              <>
                <View style={styles.pad}>
                  <SectionHeader title={t('bestSelling')} action={{ label: t('viewAll'), onPress: () => openList('best') }} />
                </View>
                <ProductRow items={best} index={idx} />
              </>
            ) : null}

            {suggested.length >= 2 ? (
              <>
                <View style={styles.pad}>
                  <SectionHeader title={recent.length ? t('recommended') : t('popularNow')} icon="spark" />
                </View>
                <ProductRow items={suggested} index={idx} />
              </>
            ) : null}

            {stores?.length ? (
              <>
                <View style={styles.pad}>
                  <SectionHeader title={t('bestShop')} action={{ label: t('viewAll'), onPress: () => router.push('/shops') }} />
                </View>
                <ShopsRow stores={stores} />
              </>
            ) : null}

            {newest.length ? (
              <>
                <View style={styles.pad}>
                  <SectionHeader title={t('newProducts')} icon="spark" action={{ label: t('viewAll'), onPress: () => openList('new') }} />
                </View>
                <ProductRow items={newest} index={idx} />
              </>
            ) : null}

            <View style={styles.pad}>
              <SectionHeader
                title={t('history')}
                icon="clock"
                action={history.length ? { label: t('viewAll'), onPress: () => router.push({ pathname: '/products', params: { src: 'history' } }) } : undefined}
                extra={history.length ? { label: t('clear'), onPress: clearHistory } : undefined}
              />
            </View>
            <HistoryRow items={history} />
            <View style={styles.bottom} />
          </>
        )}
      </Animated.ScrollView>
      <HomeHeader scrollY={scrollY} onHeight={setHeaderH} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: 14 },
  strip: { marginTop: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  top: { marginTop: 10, borderRadius: 10 },
  hero: { marginTop: 10 },
  gap: { height: 12 },
  center: { textAlign: 'center' },
  bottom: { height: 24 },
});
