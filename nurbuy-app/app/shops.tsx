import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { CatalogState } from '@/components/CatalogState';
import { Icon } from '@/components/Icon';
import { ShopCard } from '@/components/ShopCard';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { searchStores } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { useFollows } from '@/store/follows';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

/** All shops that deliver to the customer, or (?following=1) the shops the customer follows. */
export default function ShopsScreen() {
  const t = useT();
  const font = useInputFont();
  const { following } = useLocalSearchParams<{ following?: string }>();
  const idx = useIndex();
  const ids = useFollows((s) => s.ids);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const base = idx ? (following ? idx.stores.filter((s) => ids.includes(s.id)) : idx.stores) : [];
    return searchStores(base, q);
  }, [idx, following, ids, q]);

  return (
    <View style={styles.page}>
      <TopBar title={following ? t('shopsYouFollow') : t('allShops')} />
      {!idx ? (
        <CatalogState />
      ) : (
        <FlashList
          data={list}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <ShopCard s={item} style={styles.card} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.search}>
              <Icon name="search" size={18} color={colors.grey} />
              <TextInput value={q} onChangeText={setQ} placeholder={t('searchShopPh')} placeholderTextColor="#9aa1b8" style={[styles.input, { fontFamily: font }]} />
            </View>
          }
          ListEmptyComponent={<Txt size={14} color={colors.grey} style={styles.empty}>{following ? t('noFollowing') : t('noShops')}</Txt>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 14 },
  card: { marginBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 23, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 12 },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 },
  empty: { textAlign: 'center', paddingVertical: 40 },
});
