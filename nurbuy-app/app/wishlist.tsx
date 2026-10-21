import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Product } from '@/api/catalog';
import { CatalogState } from '@/components/CatalogState';
import { EditDialog } from '@/components/EditDialog';
import { Icon } from '@/components/Icon';
import { ProductGrid } from '@/components/ProductGrid';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { productName } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { useWishlist, wishKey } from '@/store/wishlist';
import { colors, TOUCH } from '@/theme';

/** Saved products: the default list and named lists. Long-press a product to move it to another list. */
export default function WishlistScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const idx = useIndex();
  const keys = useWishlist((s) => s.keys);
  const lists = useWishlist((s) => s.lists);
  const [cur, setCur] = useState('d');
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<Product | null>(null);

  const list = cur === 'd' ? undefined : lists.find((l) => l.id === cur);
  const curKeys = list ? list.ks : keys;
  const byName = useMemo(() => new Map((idx?.all ?? []).map((p) => [wishKey(p), p])), [idx]);
  const items = curKeys.map((k) => byName.get(k)).filter((p): p is Product => !!p);

  const chips = (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ id: 'd', n: t('wishDefault') }, ...lists].map((l) => (
          <Pressable key={l.id} onPress={() => setCur(l.id)} style={[styles.chip, cur === l.id && styles.chipOn]} accessibilityRole="tab" accessibilityState={{ selected: cur === l.id }}>
            <Txt weight="semibold" size={13.5} color={cur === l.id ? colors.white : colors.text}>{l.n}</Txt>
          </Pressable>
        ))}
        <Pressable onPress={() => setCreating(true)} style={[styles.chip, styles.add]} accessibilityRole="button">
          <Icon name="plus" size={16} color={colors.primary} strokeWidth={2.4} />
          <Txt weight="semibold" size={13.5} color={colors.primary}>{t('newList')}</Txt>
        </Pressable>
      </ScrollView>
      {list ? (
        <Pressable
          onPress={() => {
            useWishlist.getState().deleteList(list.id);
            setCur('d');
            toast(t('listDeleted'));
          }}
          style={styles.del}
          accessibilityRole="button"
        >
          <Txt weight="semibold" size={13} color={colors.danger}>{t('deleteList')}</Txt>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <View style={styles.page}>
      <TopBar title={t('wishlist')} />
      {idx ? <ProductGrid key={cur} items={items} index={idx} header={chips} emptyText={t('wishEmpty')} onItemLongPress={setMoving} /> : <CatalogState />}

      {creating ? (
        <EditDialog
          title={t('newList')}
          fields={[{ key: 'n', label: t('listName'), maxLength: 40 }]}
          onSave={(v) => {
            if (!v.n) return t('listName');
            useWishlist.getState().createList(v.n);
            return '';
          }}
          onClose={() => setCreating(false)}
        />
      ) : null}

      <Modal visible={!!moving} transparent animationType="fade" onRequestClose={() => setMoving(null)}>
        <Pressable style={styles.backdrop} onPress={() => setMoving(null)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {moving ? <Txt weight="bold" size={15} numberOfLines={2}>{productName(moving, lang)}</Txt> : null}
          {[{ id: 'd', n: t('wishDefault') }, ...lists]
            .filter((l) => l.id !== cur)
            .map((l) => (
              <Pressable
                key={l.id}
                style={styles.row}
                onPress={() => {
                  if (moving) useWishlist.getState().move(wishKey(moving), cur, l.id);
                  setMoving(null);
                }}
                accessibilityRole="button"
              >
                <Txt size={15}>{t('moveTo') + l.n}</Txt>
              </Pressable>
            ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  chips: { gap: 8, paddingBottom: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: TOUCH - 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  add: { borderStyle: 'dashed', borderColor: colors.primary },
  del: { alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center', marginBottom: 6 },
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 4 },
  row: { minHeight: 50, justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#f0f1f6' },
});
