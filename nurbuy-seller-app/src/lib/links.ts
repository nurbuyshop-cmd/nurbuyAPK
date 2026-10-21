import { router } from 'expo-router';

/**
 * Opens a seller-panel link from a notification ("/#/order/NBM-1", "#/wallet", "/order/NBM-1") on the matching app page.
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
      router.navigate('/orders');
      return;
    case 'notifications':
      router.push('/notifications');
      return;
    case 'pedit':
      if (/^\d+$/.test(arg) || arg === 'new') router.push({ pathname: '/product/[id]', params: { id: arg } });
      else router.navigate('/products');
      return;
    case 'products':
      router.navigate('/products');
      return;
    case 'wd':
      if (/^\d+$/.test(arg)) router.push({ pathname: '/wd/[id]', params: { id: arg } });
      else router.navigate('/wallet');
      return;
    case 'sinv':
      if (arg) router.push({ pathname: '/sinv/[id]', params: { id: arg } });
      else router.push('/txns');
      return;
    case 'txns':
      router.push('/txns');
      return;
    case 'coupons':
      router.push('/coupons');
      return;
    case 'shop':
      router.push('/shop');
      return;
    case 'boost':
      if (/^\d+$/.test(arg)) router.push({ pathname: '/boost/[id]', params: { id: arg } });
      else router.push('/boost');
      return;
    case 'wallet':
    case 'withdraw':
      router.navigate('/wallet');
      return;
    case 'profile':
      router.navigate('/profile');
      return;
    default:
      router.navigate('/home');
  }
}
