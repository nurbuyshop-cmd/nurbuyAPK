import { ApiError } from '@/api/api';
import type { StringKey } from '@/i18n/en';

type T = (k: StringKey) => string;

const BY_CODE: Record<string, StringKey> = {
  not_approved: 'errNotApproved',
  suspended: 'errSuspended',
  bad_state: 'errBadState',
  order_closed: 'errOrderClosed',
};

/** Turns any thrown value into a message for the seller in the current language (website errMsg()). */
export function errorText(e: unknown, t: T): string {
  if (!(e instanceof ApiError)) return t('errGeneric');
  if (e.status === 0) return t('errNetwork');
  const c = e.code ? BY_CODE[e.code] : undefined;
  if (c) return t(c);
  if (e.status === 404) return t('errNotFound');
  if (e.status === 429) return t('errTooMany');
  if (e.status === 413) return t('errTooLarge');
  if (e.status === 415) return t('errFileType');
  if (e.status === 401) return t('errBadLogin');
  if (e.status >= 500 || !e.error) return t('errServer');
  return e.error;
}

const FIELD: Record<string, StringKey> = {
  shop_name: 'fShopName',
  owner_name: 'fOwnerName',
  mobile: 'fMobile',
  email: 'fEmail',
  address: 'fAddress',
  nid: 'fNid',
  password: 'fPassword',
  current: 'fCurrent',
  reason: 'fReason',
};

const DUP: Record<string, StringKey> = { mobile: 'dupMobile', email: 'dupEmail', shop_name: 'dupShop' };

/** The message for the form field the server complained about ('' when the error is not about a field). */
export function fieldText(e: unknown, t: T): string {
  if (!(e instanceof ApiError) || !e.field) return '';
  const dup = DUP[e.field];
  if (e.status === 409 && dup) return t(dup);
  if (e.status === 413 || e.status === 415) return errorText(e, t);
  const k = FIELD[e.field];
  return k && e.status === 400 ? t(k) : e.error;
}

export const errorField = (e: unknown): string => (e instanceof ApiError && e.field ? e.field : '');
