import { ApiError } from '@/api/api';
import type { StringKey } from '@/i18n/en';

/** Server messages that have a translated text in the app. */
const BY_MESSAGE: Record<string, StringKey> = {
  'Invalid email/mobile or password': 'vBadLogin',
  'Enter a valid mobile number (01XXXXXXXXX)': 'vMobile',
  'Enter a valid email address': 'vEmail',
  'Password must be at least 6 characters': 'vPwShort',
  'This mobile number is already registered': 'vMobileTaken',
  'This email is already registered': 'vEmailTaken',
  'Name is required': 'vName',
  'Address is required': 'vAddress',
};

/** Error codes the order, coupon and zone endpoints send. */
const BY_CODE: Record<string, StringKey> = {
  login_required: 'authNeedTitle',
  insufficient_wallet: 'errWallet',
  pin_required: 'errPin',
  outside_zone: 'errOutside',
  shop_no_delivery: 'errShopNoDelivery',
  shop_closed: 'errShopClosed',
  price_changed: 'errPrice',
  item_unavailable: 'errGone',
  variant_out_of_stock: 'errStock',
  variant_unavailable: 'errStock',
  out_of_stock: 'errStock',
  max_qty: 'errMaxQty',
  coupon_invalid: 'cpnInvalid',
  coupon_not_started: 'cpnNotStarted',
  coupon_expired: 'cpnExpired',
  coupon_used_up: 'cpnUsedUp',
  coupon_wrong_product: 'cpnWrongProduct',
  coupon_wrong_seller: 'cpnWrongSeller',
  coupon_user_limit: 'cpnUserLimit',
  coupon_min: 'cpnMin',
};

/** Turns any thrown value into a message for the customer in the current language. */
export function errorText(e: unknown, t: (k: StringKey) => string): string {
  if (e instanceof ApiError) {
    if (e.status === 0) return t('errNetwork');
    if (e.status === 429) return t('errTooMany');
    if (e.status === 503) return t('errMaint');
    if (e.code) {
      if (e.code.startsWith('loc_')) return t('errLoc');
      const c = BY_CODE[e.code];
      if (c) return t(c);
    }
    const k = BY_MESSAGE[e.error];
    if (k) return t(k);
    if (e.status >= 500) return t('errGeneric');
    return e.error || t('errGeneric');
  }
  return t('errGeneric');
}
