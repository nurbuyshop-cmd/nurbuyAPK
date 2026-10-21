import { useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { markNotifsRead, type Notif } from '@/api/notifications';
import { Icon, type IconName } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { shortDate } from '@/lib/dates';
import { openAppLink } from '@/lib/links';
import { useIndex } from '@/lib/useIndex';
import { useNotifs } from '@/lib/useNotifs';
import { useI18n, useT } from '@/store/i18n';
import { colors, radius, shadow, TOUCH } from '@/theme';

const KIND_ICON: Record<string, IconName> = { order: 'box', wallet: 'wallet', chat: 'chat', admin: 'bell' };

/** Notification centre (/me/notifications): tap one to open its order, wallet, chat or product. */
export default function NotificationsScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const q = useNotifs();
  const qc = useQueryClient();
  const idx = useIndex();
  const unread = q.data?.unread ?? 0;

  // refresh when the page opens
  useEffect(() => {
    void q.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAll = async () => {
    await markNotifsRead().catch(() => {});
    void qc.invalidateQueries({ queryKey: ['notifs'] });
  };

  const open = (n: Notif) => {
    if (!n.read) {
      markNotifsRead([n.id])
        .then(() => qc.invalidateQueries({ queryKey: ['notifs'] }))
        .catch(() => {});
    }
    if (n.url) openAppLink(n.url, idx);
  };

  return (
    <View style={styles.page}>
      <TopBar
        title={t('notifications')}
        right={
          unread ? (
            <Pressable onPress={() => void markAll()} style={styles.markAll} accessibilityRole="button">
              <Txt weight="bold" size={13} color={colors.primary}>{t('markAllRead')}</Txt>
            </Pressable>
          ) : undefined
        }
      />
      {q.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.load} />
      ) : (
        <FlashList
          data={q.data?.list ?? []}
          keyExtractor={(n) => String(n.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} colors={[colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="bell" size={44} color={colors.grey} />
              <Txt size={14} color={colors.grey} style={styles.center}>{t('noNotifs')}</Txt>
            </View>
          }
          renderItem={({ item: n }) => (
            <Pressable onPress={() => open(n)} style={[styles.card, !n.read && styles.unread]} accessibilityRole="button">
              <View style={styles.ic}>
                <Icon name={KIND_ICON[n.kind] ?? 'bell'} size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Txt weight="bold" size={14.5}>{n.title}</Txt>
                {n.body ? <Txt size={13.5} color="#444" style={styles.body}>{n.body}</Txt> : null}
                {n.img ? <Image source={n.img} style={styles.img} contentFit="cover" /> : null}
                <Txt size={12} color={colors.grey}>{shortDate(n.at, lang)}</Txt>
              </View>
              {!n.read ? <View style={styles.dot} /> : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  load: { marginTop: 40 },
  list: { padding: 12 },
  flex: { flex: 1, minWidth: 0, gap: 3 },
  center: { textAlign: 'center' },
  markAll: { minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: 4 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginBottom: 10, ...shadow.card },
  unread: { backgroundColor: '#f3f5ff' },
  ic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  body: { lineHeight: 20 },
  img: { width: '100%', height: 140, borderRadius: 10, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange, marginTop: 6 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 60, paddingHorizontal: 24 },
});
