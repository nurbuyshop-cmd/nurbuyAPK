import { router } from 'expo-router';

/**
 * Opens a rider-panel link from a notification ("/#/order/NBM-1", "#/earnings", "/wd/3") on the matching app page.
 * Pages that are not in the app yet open the home page.
 */
export function openPanelLink(url: string): void {
  const path = url.replace(/^\/?#/, '').replace(/^\/+/, '');
  const [name = '', ...rest] = path.split('/');
  const arg = decodeURIComponent(rest.join('/'));
  switch (name) {
    case 'order':
      if (arg) router.push({ pathname: '/order/[id]', params: { id: arg } });
      else router.navigate('/orders');
      return;
    case 'orders':
      router.navigate({ pathname: '/orders', params: arg === 'active' || arg === 'pending' ? { tab: arg } : {} });
      return;
    case 'home':
      router.navigate('/home');
      return;
    case 'history':
      router.navigate('/history');
      return;
    case 'cash':
      router.push('/cash');
      return;
    case 'wd':
      if (/^\d+$/.test(arg)) router.push({ pathname: '/wd/[id]', params: { id: arg } });
      else router.push('/earnings');
      return;
    case 'earnings':
    case 'withdraw':
      router.push('/earnings');
      return;
    case 'notifications':
      router.navigate('/notifications');
      return;
    case 'profile':
      router.navigate('/profile');
      return;
    default:
      router.navigate('/home');
  }
}
