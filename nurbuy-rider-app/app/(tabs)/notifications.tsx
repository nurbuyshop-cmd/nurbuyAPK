import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { markNotificationsRead, notifications } from '@/api/rider';
import { NotifCards } from '@/components/NotifCards';
import { PushBanner } from '@/components/PushBanner';
import { TopBar } from '@/components/TopBar';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useDash } from '@/store/dash';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

/** NurBuy's messages and order alerts; opening the tab marks them read (website scrNotifs()). */
export default function Notifications() {
  const t = useT();
  const { data, error, reload } = useLoad('notifs', notifications);
  const [refreshing, setRefreshing] = useState(false);

  // the tab stays mounted: read the list again each time it is opened
  const first = data === undefined;
  useFocusEffect(
    useCallback(() => {
      if (!first) void reload();
    }, [first, reload]),
  );

  // a new message arrived while the tab is open (the 15-second check counts it): show it
  const dashUnread = useDash((s) => s.unread);
  useEffect(() => {
    if (dashUnread > 0) void reload();
  }, [dashUnread, reload]);

  const unread = data?.unread ?? 0;
  useEffect(() => {
    if (unread > 0)
      void markNotificationsRead()
        .then(() => useDash.getState().setUnread(0))
        .catch(() => {});
  }, [unread]);

  return (
    <View style={styles.flex}>
      <TopBar title={t('notifications')} />
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
          <PushBanner />
          {data.list.length ? <NotifCards list={data.list} /> : <Empty icon="bell" title={t('noNotifs')} sub={t('noNotifsSub')} />}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
});
