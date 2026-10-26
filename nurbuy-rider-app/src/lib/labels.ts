import type { DelayReason, FailReason, ReportReason, RStat, UploadKind, Vehicle } from '@/api/rider';
import type { IconName } from '@/components/Icon';
import type { ChipTone } from '@/components/ui';
import type { StringKey } from '@/i18n/en';

type T = (k: StringKey) => string;

/** Website RS: delivery step label and chip colour. */
export const RSTAT_LABEL: Record<RStat, [StringKey, ChipTone]> = {
  assigned: ['rsAssigned', 'amber'],
  accepted: ['rsAccepted', 'blue'],
  going: ['rsGoing', 'blue'],
  picked: ['rsPicked', 'purple'],
  ontheway: ['rsOntheway', 'purple'],
  arrived: ['rsArrived', 'purple'],
  delivered: ['rsDelivered', 'green'],
  failed: ['rsFailed', 'red'],
  rejected: ['rsRejected', 'red'],
  cancelled: ['rsCancelled', 'red'],
};

/** Website STEPS: the progress list on the order page. */
export const STEPS: [RStat, StringKey][] = [
  ['assigned', 'stAssigned'],
  ['accepted', 'stAccepted'],
  ['going', 'rsGoing'],
  ['picked', 'rsPicked'],
  ['ontheway', 'rsOntheway'],
  ['arrived', 'rsArrived'],
  ['delivered', 'stDelivered'],
];

/** Website NEXT: the next-step button of a running delivery. */
export const NEXT_STEP: Partial<Record<RStat, ['going' | 'picked' | 'ontheway' | 'arrived', StringKey]>> = {
  accepted: ['going', 'nextGoing'],
  going: ['picked', 'nextPicked'],
  picked: ['ontheway', 'nextOntheway'],
  ontheway: ['arrived', 'nextArrived'],
};

export const FAIL_LABEL: Record<FailReason, StringKey> = {
  customer_unreachable: 'frUnreachable',
  customer_not_home: 'frNotHome',
  wrong_address: 'frWrongAddress',
  customer_refused: 'frRefused',
  vehicle_problem: 'frVehicle',
  other: 'other',
};

export const DELAY_LABEL: Record<DelayReason, StringKey> = {
  traffic: 'drTraffic',
  weather: 'drWeather',
  shop: 'drShop',
  address: 'drAddress',
  vehicle: 'drVehicle',
  other: 'other',
};

export const REPORT_LABEL: Record<ReportReason, StringKey> = {
  fake_order: 'rpFake',
  repeated_failed: 'rpRepeated',
  wrong_contact: 'rpWrongContact',
  other: 'rpOther',
};

/** "customer_not_home: note" -> "Customer not at home - note" (website failText()). */
export function failText(fr: string, t: T): string {
  if (!fr) return '';
  const i = fr.indexOf(': ');
  const k = i > 0 ? fr.slice(0, i) : fr;
  const note = i > 0 ? fr.slice(i + 2) : '';
  const label = k in FAIL_LABEL ? t(FAIL_LABEL[k as FailReason]) : k;
  return note ? `${label} - ${note}` : label;
}

/** Website payLabel(). */
export const payText = (p: string, t: T): string => t(p === 'cod' ? 'payCod' : p === 'wallet' ? 'payWallet' : 'payOnline');

/** Website vehLabel(). */
export const VEHICLE_LABEL: Record<Vehicle, StringKey> = { cycle: 'vehCycle', bike: 'vehBike', car: 'vehCar' };
export const VEHICLE_ICON: Record<Vehicle, IconName> = { cycle: 'cycle', bike: 'bike', car: 'car' };

export const vehicleText = (v: string, t: T): string =>
  v === 'cycle' || v === 'bike' || v === 'car' ? t(VEHICLE_LABEL[v]) : '-';

/** Website docLabel(). */
export const DOC_LABEL: Record<UploadKind, StringKey> = { photo: 'docPhoto', nid_front: 'docNidFront', nid_back: 'docNidBack', license: 'docLicense' };

/** Labels of the fields that wait for admin approval (website CHGL). */
export const CHANGE_LABEL: Record<string, StringKey> = { mobile: 'mobile', email: 'email', vehicle_type: 'vehicleType', vehicle_no: 'vehicleNo', license_no: 'licenseNo' };
