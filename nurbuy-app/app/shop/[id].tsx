import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BannerSlot } from '@/components/BannerSlot';
import { CatalogState } from '@/components/CatalogState';
import { FollowButton } from '@/components/FollowButton';
import { Icon } from '@/components/Icon';
import { ProductGrid } from '@/components/ProductGrid';
import { ShopClosedText } from '@/components/ShopClosedText';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import type { Placement } from '@/lib/banners';
import { thumb } from '@/lib/imageUrl';
import { searchProducts, shopState } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { clock, dhakaNow } from '@/lib/time';
import { useNow } from '@/lib/useNow';
import { useFollows } from '@/store/follows';
import { digits, useI18n, useT, weekday } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

const STORE_SPOT: Placement[] = ['store'];

/** Shop page: cover, logo, name, followers and open state on top, then the shop's products. */
export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const idx = useIndex();
  const s = idx && id ? idx.storeById.get(id) : undefined;
  const items = useMemo(() => (idx && s ? [...idx.hot, ...idx.best].filter((p) => p.sh === s.n) : []), [idx, s]);
  const liveCount = useFollows((x) => (id ? x.counts[id] : undefined));
  const today = dhakaNow(useNow(60000))[0];
  const [cat, setCat] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const inputFont = useInputFont();

  // the categories this shop actually sells in, in the order they first appear
  const cats = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of items) if (p.cat && !seen.has(p.cat)) seen.set(p.cat, lang === 'bn' ? p.catBn || p.cat : p.cat);
    return [...seen];
  }, [items, lang]);
  // the search and the category filter only look inside this shop
  const shown = useMemo(() => {
    const byCat = cat ? items.filter((p) => p.cat === cat) : items;
    return query.trim() ? searchProducts(byCat, query) : byCat;
  }, [items, cat, query]);

  if (!idx || !s) {
    return (
      <View style={styles.page}>
        <TopBar title="" />
        {!idx ? <CatalogState /> : <Txt size={15} color={colors.grey} style={styles.none}>{t('noShops')}</Txt>}
      </View>
    );
  }
  const st = shopState(s);

  const header = (
    <View style={styles.head}>
      <View style={styles.cover}>
        {s.cover ? <Image source={thumb(s.cover, 960)} style={styles.full} contentFit="cover" /> : null}
      </View>
      <View style={styles.info}>
        <View style={styles.logo}>
          {s.img ? <Image source={thumb(s.img, 320)} style={styles.full} contentFit="cover" /> : <Icon name="store" size={30} color={colors.primary} />}
        </View>
        <View style={styles.flex}>
          <Txt weight="bold" size={19} numberOfLines={2}>{s.n}</Txt>
          <Txt size={13} color={colors.grey}>{digits(liveCount ?? s.fl, lang) + ' ' + t('followers')}</Txt>
        </View>
        <FollowButton storeId={s.id} />
      </View>
      <View style={styles.chips}>
        {s.cat ? <Chip text={s.cat} /> : null}
        <Chip text={st.open ? t('openNow') : st.food ? t('restClosed') : t('closed')} tone={st.open ? 'ok' : 'bad'} />
        <Chip text={t('homeDelivery')} />
      </View>
      {!st.open ? <ShopClosedText state={st} size={13} color={colors.danger} /> : null}
      {s.about ? <Txt size={14} color="#333" style={styles.about}>{s.about}</Txt> : null}
      {s.hours ? (
        <View style={styles.hours}>
          <Txt weight="bold" size={15}>{t('openingHours')}</Txt>
          {s.hours.map((h, d) => (
            <View key={d} style={styles.hRow}>
              <Txt size={13.5} color={d === today ? colors.primary : colors.text} weight={d === today ? 'bold' : 'regular'} style={styles.flex}>{weekday(d, lang)}</Txt>
              <Txt size={13.5} color={h ? colors.text : colors.danger}>{h ? digits(`${clock(h[0])} – ${clock(h[1] % 1440)}`, lang) : t('closedDay')}</Txt>
            </View>
          ))}
        </View>
      ) : null}
      <BannerSlot placements={STORE_SPOT} />
      <Txt weight="bold" size={17} style={styles.h}>{t('products')}</Txt>
      {cats.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          <CatChip text={t('all')} on={cat === null} onPress={() => setCat(null)} />
          {cats.map(([key, label]) => <CatChip key={key} text={label} on={cat === key} onPress={() => setCat(key)} />)}
        </ScrollView>
      ) : null}
    </View>
  );

  return (
    <View style={styles.page}>
      <TopBar
        title={s.n}
        right={
          <Pressable
            onPress={() => {
              if (searching) setQuery('');
              setSearching(!searching);
            }}
            style={styles.searchBtn}
            accessibilityRole="button"
            accessibilityLabel={t('searchProduct')}
          >
            <Icon name={searching ? 'x' : 'search'} size={20} color={colors.text} />
          </Pressable>
        }
      />
      {searching ? (
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.primary} strokeWidth={2.4} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder={t('searchPh')}
            placeholderTextColor="#8a90a8"
            returnKeyType="search"
            style={[styles.searchInput, { fontFamily: inputFont }]}
          />
        </View>
      ) : null}
      <ProductGrid items={shown} index={idx} header={header} />
    </View>
  );
}

function CatChip({ text, on, onPress }: { text: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.catChip, on && styles.catOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
      <Txt weight="semibold" size={13} color={on ? colors.white : colors.text} numberOfLines={1}>{text}</Txt>
    </Pressable>
  );
}

function Chip({ text, tone }: { text: string; tone?: 'ok' | 'bad' }) {
  return (
    <View style={[styles.chip, tone === 'ok' && styles.ok, tone === 'bad' && styles.bad]}>
      <Txt weight="semibold" size={12.5} color={tone === 'ok' ? '#12a150' : tone === 'bad' ? colors.danger : colors.text}>{text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  none: { textAlign: 'center', padding: 32 },
  flex: { flex: 1, minWidth: 0 },
  full: { width: '100%', height: '100%' },
  head: { gap: 10, marginBottom: 6 },
  cover: { height: 130, borderRadius: radius.lg, backgroundColor: '#dbe5ff', overflow: 'hidden' },
  // only the logo overlaps the cover; name, followers and the follow button sit fully below it
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10 },
  logo: { marginTop: -34, width: 72, height: 72, borderRadius: 18, borderWidth: 3, borderColor: colors.white, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...shadow.card },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  ok: { backgroundColor: '#e3f6ea', borderColor: '#e3f6ea' },
  bad: { backgroundColor: colors.dangerBg, borderColor: colors.dangerBg },
  about: { lineHeight: 21 },
  hours: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 4 },
  hRow: { flexDirection: 'row', paddingVertical: 3 },
  h: { marginTop: 6 },
  catRow: { gap: 8, paddingVertical: 2 },
  catChip: { minHeight: 36, justifyContent: 'center', borderRadius: 18, paddingHorizontal: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  catOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  searchBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, marginHorizontal: 12, marginTop: 10, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 24, paddingHorizontal: 14, backgroundColor: colors.white },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },
});
