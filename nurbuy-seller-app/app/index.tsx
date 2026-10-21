import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/api';
import { ErrorBox, Spinner } from '@/components/ui';
import { useAuth } from '@/store/auth';
import { colors } from '@/theme';

/**
 * The start address: the gate in the root layout moves on to login, status or home at once.
 * Only a first start with a saved login but no internet stays here, with "Try again".
 */
export default function Index() {
  const stuck = useAuth((s) => s.status === 'seller' && !s.seller);
  const [busy, setBusy] = useState(false);
  return (
    <View style={styles.page}>
      {stuck && !busy ? (
        <ErrorBox
          error={new ApiError(0, {})}
          onRetry={() => {
            setBusy(true);
            void useAuth.getState().refreshMe().finally(() => setBusy(false));
          }}
        />
      ) : (
        <Spinner />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: 'center', backgroundColor: colors.bg },
});
