import { Hind_400Regular, Hind_500Medium, Hind_600SemiBold, Hind_700Bold } from '@expo-google-fonts/hind';
import { NotoSansBengali_400Regular } from '@expo-google-fonts/noto-sans-bengali';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CrashScreen } from '@/components/CrashScreen';
import { NewOrderAlert } from '@/components/NewOrderAlert';
import { OfflineBar } from '@/components/OfflineBar';
import { showsTabBar, TabBar } from '@/components/TabBar';
import { Toast } from '@/components/Toast';
import { POLL_MS } from '@/config';
import { openPanelLink } from '@/lib/links';
import { listenNotificationTaps, registerPush } from '@/lib/push';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { translate, useI18n } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** Any page that fails unexpectedly shows this instead of a white screen. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <CrashScreen retry={retry} />;
}

void SplashScreen.preventAutoHideAsync();

async function boot(): Promise<void> {
  await useI18n.getState().hydrate();
  await useAuth.getState().hydrate();
}

const SCREEN_OPTIONS = { headerShown: false, contentStyle: { backgroundColor: colors.bg } };
const NO_GESTURE = { gestureEnabled: false };

/** Where the seller may be: logged out -> login/apply; not approved -> status; approved -> the panel. */
function targetFor(path: string): string | null {
  const a = useAuth.getState();
  if (a.status === 'boot') return null;
  if (a.status === 'guest') return path === '/login' || path === '/apply' ? null : '/login';
  if (a.applying) return path === '/apply' ? null : '/apply';
  const st = a.seller?.status;
  if (!st) return null;
  if (st !== 'approved') return path === '/status' ? null : '/status';
  return path === '/' || path === '/login' || path === '/apply' || path === '/status' ? '/home' : null;
}

/** Keeps the seller on the right pages when the login or the shop's approval changes. Draws nothing. */
function Gate() {
  const pathname = usePathname();
  const status = useAuth((s) => s.status);
  const applying = useAuth((s) => s.applying);
  const sellerStatus = useAuth((s) => s.seller?.status);

  useEffect(() => {
    const to = targetFor(pathname);
    if (to && to !== pathname) router.replace(to as never);
  }, [pathname, status, applying, sellerStatus]);

  // a login that expired on the server: say so once on the login page
  useEffect(
    () =>
      useAuth.subscribe((s, p) => {
        if (s.expired && !p.expired) {
          toast(translate('sessionExpired', useI18n.getState().lang), 'bad');
          useAuth.setState({ expired: false });
        }
        // approval arrived while the status page was open
        if (p.seller?.status && p.seller.status !== 'approved' && s.seller?.status === 'approved' && !s.applying) {
          toast(translate('approvedWelcome', useI18n.getState().lang), 'ok', 5000);
        }
      }),
    [],
  );
  return null;
}

/**
 * Every 20 s while the app is in front (like the website): approved shops refresh the dashboard (new orders ring
 * and show a message); shops waiting for approval re-check their status.
 */
function usePolling(ready: boolean) {
  const status = useAuth((s) => s.status);
  const approved = useAuth((s) => s.seller?.status === 'approved');
  const applying = useAuth((s) => s.applying);

  const tick = useCallback(() => {
    if (AppState.currentState !== 'active') return;
    const a = useAuth.getState();
    if (a.status !== 'seller' || a.applying) return;
    if (a.seller?.status === 'approved') void useDash.getState().load().catch(() => {});
    else void a.refreshMe();
  }, []);

  useEffect(() => {
    if (!ready || status !== 'seller' || applying) return;
    tick();
    const id = setInterval(tick, POLL_MS);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && tick());
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [ready, status, approved, applying, tick]);

  return tick;
}

function BottomBar() {
  const pathname = usePathname();
  const approved = useAuth((s) => s.seller?.status === 'approved');
  return approved && showsTabBar(pathname) ? <TabBar /> : null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Hind_400Regular, Hind_500Medium, Hind_600SemiBold, Hind_700Bold, NotoSansBengali_400Regular });
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    boot().finally(() => setBooted(true));
  }, []);

  const authStatus = useAuth((s) => s.status);
  const ready = booted && (fontsLoaded || !!fontError) && authStatus !== 'boot';

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // the phone's status bar stays hidden inside the app, like the customer app (some phones kept blinking its icons)
  useEffect(() => {
    if (!ready) return;
    StatusBar.setHidden(true, 'none');
    const sub = AppState.addEventListener('change', (s) => s === 'active' && StatusBar.setHidden(true, 'none'));
    return () => sub.remove();
  }, [ready]);

  const tick = usePolling(ready);

  // phone push: register this phone after login (also on an app start with a saved login, and when the app comes back)
  useEffect(() => {
    if (!ready || authStatus !== 'seller') return;
    void registerPush();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && void registerPush());
    return () => sub.remove();
  }, [ready, authStatus]);

  // tapping a notification opens its order, wallet, boost... (also when it started the app)
  useEffect(() => {
    if (!ready) return;
    return listenNotificationTaps((url) => {
      if (/^https?:\/\//.test(url)) void Linking.openURL(url);
      else if (useAuth.getState().seller?.status === 'approved') openPanelLink(url);
    });
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <Gate />
        <Stack screenOptions={SCREEN_OPTIONS}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" options={NO_GESTURE} />
          <Stack.Screen name="apply" options={NO_GESTURE} />
          <Stack.Screen name="status" options={NO_GESTURE} />
        </Stack>
        <BottomBar />
        <NewOrderAlert />
        <OfflineBar onBack={tick} />
        <Toast />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
