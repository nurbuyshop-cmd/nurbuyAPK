import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { Product } from '@/api/catalog';
import { adClicked, adSeen } from '@/lib/ads';
import type { Placement } from '@/lib/banners';
import { thumb } from '@/lib/imageUrl';
import { money } from '@/lib/money';
import { productName } from '@/lib/products';
import { useBanners } from '@/lib/useBanners';
import { useIndex } from '@/lib/useIndex';
import { useCatalog } from '@/store/catalog';
import { useI18n, useT } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { AutoSlider } from './AutoSlider';
import { BannerSlot } from './BannerSlot';
import { Txt } from './Txt';

type Ad = { c: number; p: Product };

const SPONSORED: Placement[] = ['sponsored'];
const CARD_W = 250;
const GAP = 10;

const adKey = (a: Ad) => String(a.c);

/**
 * The home "Sponsored" spot: Banner Studio "sponsored" banners while one is live, otherwise up to four boosted products.
 * A boosted card counts a view when it is fully on screen, and a click when tapped.
 */
export function SponsoredRow() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const idx = useIndex();
  const ads = useCatalog((s) => s.catalog?.ads);
  const hasBanner = useBanners(SPONSORED).list.length > 0;

  const items = useMemo<Ad[]>(() => {
    const out: Ad[] = [];
    for (const a of ads ?? []) {
      const p = idx?.byId.get(a.p);
      if (p && out.length < 4) out.push({ c: a.c, p });
    }
    return out;
  }, [ads, idx]);

  const { width } = useWindowDimensions();
  const visible = Math.max(1, Math.floor((width - 14) / (CARD_W + GAP)));
  // a boosted card counts a view when it is fully on screen (after each slide)
  const onIndex = (first: number) => {
    for (let i = 0; i < visible && i < items.length; i++) {
      const a = items[(first + i) % items.length];
      if (a) adSeen(a.c);
    }
  };

  const renderAd = useCallback(
    (item: Ad) => (
      <Pressable
        style={styles.card}
        onPress={() => {
          adClicked(item.c);
          router.push({ pathname: '/product/[id]', params: { id: item.p.id } });
        }}
        accessibilityRole="button"
        accessibilityLabel={`${t('sponsored')}: ${productName(item.p, lang)}`}
      >
        <Image source={item.p.img ? thumb(item.p.img, 320) : undefined} style={styles.img} contentFit="contain" />
        <View style={styles.info}>
          <Txt weight="semibold" size={13} numberOfLines={2}>{productName(item.p, lang)}</Txt>
          <Txt weight="bold" size={14} color={colors.primary}>{money(item.p.pr, lang)}</Txt>
          <View style={styles.tag}>
            <Txt size={10} color={colors.grey}>{t('sponsored')}</Txt>
          </View>
        </View>
      </Pressable>
    ),
    [t, lang],
  );

  if (hasBanner) return <BannerSlot placements={SPONSORED} style={styles.banner} />;
  if (!items.length) return null;

  return (
    <View style={styles.wrap}>
      <Txt weight="semibold" size={12} color={colors.grey} style={styles.label}>{t('sponsored')}</Txt>
      <AutoSlider
        data={items}
        keyOf={adKey}
        itemWidth={CARD_W}
        gap={GAP}
        padding={14}
        visible={visible}
        onIndex={onIndex}
        renderItem={renderAd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginTop: 12 },
  wrap: { marginTop: 12 },
  label: { paddingHorizontal: 14, marginBottom: 6 },
  card: { flexDirection: 'row', gap: 10, backgroundColor: colors.white, borderRadius: radius.lg, padding: 10, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  img: { width: 72, height: 72, borderRadius: 10, backgroundColor: colors.white },
  info: { flex: 1, minWidth: 0, gap: 3 },
  tag: { alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 5 },
});
