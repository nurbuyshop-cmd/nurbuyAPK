import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { markNotificationsRead, notifications } from '@/api/seller';
import { NotifCards } from '@/components/NotifCards';
import { TopBar } from '@/components/TopBar';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useDash } from '@/store/dash';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

/** NurBuy's messages and order alerts; opening the page marks them read (website scrNotifs()). */
export default function Notifications() {
  const t = useT();
  const { data, error, reload } = useLoad('notifs', notifications);
  const [refreshing, setRefreshing] = useState(false);

  const unread = data?.unread ?? 0;
  useEffect(() => {
    if (unread > 0)
      void markNotificationsRead()
        .then(() => useDash.getState().setUnread(0))
        .catch(() => {});
  }, [unread]);

  return (
    <View style={styles.flex}>
      <TopBar title={t('notifications')} back backTo="/profile" />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await reload();
                setRefreshing(false);
              }}
            />
          }
        >
          {data.list.length ? <NotifCards list={data.list} /> : <Empty icon="bell" title={t('noNotifs')} sub={t('noNotifsSub')} />}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, paddingBottom: 30 },
});
