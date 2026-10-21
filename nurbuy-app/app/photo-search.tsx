import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CatalogState } from '@/components/CatalogState';
import { Icon } from '@/components/Icon';
import { openPhotoSearch } from '@/components/PhotoSearchSheet';
import { ProductGrid } from '@/components/ProductGrid';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { useIndex } from '@/lib/useIndex';
import { searchByPhoto } from '@/lib/vision';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors, radius } from '@/theme';

/** Results of a photo search: the photo, the words found in it, then the matching products. */
export default function PhotoSearchScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const idx = useIndex();

  const q = useQuery({
    queryKey: ['photo-search', uri, !!idx],
    enabled: !!uri && !!idx,
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
    queryFn: () => searchByPhoto(uri, idx?.all ?? []),
  });

  if (!idx) {
    return (
      <View style={styles.page}>
        <TopBar title={t('photoSearch')} />
        <CatalogState />
      </View>
    );
  }

  const r = q.data;
  const head = (
    <View style={styles.head}>
      <View style={styles.photoRow}>
        {uri ? <Image source={{ uri }} style={styles.photo} contentFit="cover" accessibilityIgnoresInvertColors /> : null}
        <View style={styles.flex}>
          {q.isPending ? (
            <View style={styles.reading}>
              <ActivityIndicator color={colors.primary} />
              <Txt size={14} color={colors.grey}>{t('photoReading')}</Txt>
            </View>
          ) : q.isError ? (
            <Txt size={14} color={colors.danger}>{t('photoError')}</Txt>
          ) : r && r.items.length ? (
            <Txt weight="bold" size={16}>{r.exact ? fmt(t('photoFound'), { n: r.items.length }, lang) : t('photoSimilar')}</Txt>
          ) : (
            <Txt weight="bold" size={15}>{t('photoNone')}</Txt>
          )}
          <Pressable onPress={openPhotoSearch} style={styles.again} accessibilityRole="button">
            <Icon name="cam" size={18} color={colors.primary} />
            <Txt weight="semibold" size={13.5} color={colors.primary}>{t('photoAgain')}</Txt>
          </Pressable>
        </View>
      </View>

      {r?.keywords.length ? (
        <View>
          <Txt size={12.5} color={colors.grey} style={styles.kwTitle}>{t('photoDetected')}</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kwRow}>
            {r.keywords.map((k) => (
              <Pressable
                key={k}
                onPress={() => router.push({ pathname: '/search', params: { q: k } })}
                style={styles.kw}
                accessibilityRole="button"
                accessibilityLabel={`${t('searchProduct')}: ${k}`}
              >
                <Icon name="search" size={14} color={colors.primary} />
                <Txt latin weight="semibold" size={13}>{k}</Txt>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {q.isError ? <Button label={t('retry')} variant="outline" onPress={() => void q.refetch()} /> : null}
      {r && !r.items.length ? (
        <View style={styles.none}>
          <Txt size={14} color={colors.grey} style={styles.center}>{t('photoNoneTip')}</Txt>
          <Button label={t('photoTyping')} variant="outline" onPress={() => router.push('/search')} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.page}>
      <TopBar title={t('photoSearch')} />
      {r?.items.length ? (
        <ProductGrid items={r.items} index={idx} header={head} />
      ) : (
        <ScrollView contentContainerStyle={styles.pad}>{head}</ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  pad: { padding: 14 },
  head: { gap: 12, marginBottom: 12 },
  photoRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  photo: { width: 92, height: 92, borderRadius: radius.lg, backgroundColor: '#eef0fa' },
  flex: { flex: 1, minWidth: 0, gap: 6 },
  reading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  again: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 36 },
  kwTitle: { marginBottom: 6 },
  kwRow: { gap: 8 },
  kw: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 34, paddingHorizontal: 12, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  none: { gap: 12, marginTop: 8 },
  center: { textAlign: 'center' },
});
