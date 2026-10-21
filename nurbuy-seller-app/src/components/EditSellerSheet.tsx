import { useState } from 'react';

import { updateMe } from '@/api/seller';
import type { StringKey } from '@/i18n/en';
import { errorField, errorText, fieldText } from '@/lib/errors';
import { normMobile, validEmail, validMobile, validNid, validShopName } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';

import { Button } from './Button';
import { Field } from './Field';
import { Sheet } from './Sheet';
import { Banner } from './ui';

type Key = 'shop_name' | 'owner_name' | 'address' | 'category' | 'about' | 'mobile' | 'email' | 'nid' | 'trade_no';

/**
 * Edit application (before approval: everything) or profile (after approval: shop name, NID and trade number are fixed,
 * a new mobile / email waits for admin approval). Website openEdit().
 */
export function EditSellerSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const seller = useAuth((s) => s.seller);
  const setSeller = useAuth((s) => s.setSeller);
  const appr = seller?.status === 'approved';
  const [v, setV] = useState<Record<Key, string>>(() => ({
    shop_name: seller?.shop_name ?? '',
    owner_name: seller?.owner_name ?? '',
    address: seller?.address ?? '',
    category: seller?.category ?? '',
    about: seller?.about ?? '',
    mobile: seller?.mobile ?? '',
    email: seller?.email ?? '',
    nid: seller?.nid ?? '',
    trade_no: seller?.trade_no ?? '',
  }));
  const [err, setErr] = useState<Partial<Record<Key, string>>>({});
  const [busy, setBusy] = useState(false);
  if (!seller) return null;

  const set = (k: Key) => (x: string) => {
    setV((s) => ({ ...s, [k]: x }));
    if (err[k]) setErr((s) => ({ ...s, [k]: undefined }));
  };

  const save = async () => {
    const e: Partial<Record<Key, string>> = {};
    const need = (k: Key, ok: boolean, msg: StringKey) => {
      if (!ok) e[k] = t(msg);
    };
    if (!appr) {
      need('shop_name', validShopName(v.shop_name), 'fShopName');
      need('nid', validNid(v.nid), 'fNid');
    }
    need('owner_name', v.owner_name.trim().length >= 2, 'fOwnerName');
    need('address', !!v.address.trim(), 'fAddress');
    need('mobile', validMobile(v.mobile), 'fMobile');
    need('email', !v.email.trim() || validEmail(v.email.trim()), 'fEmail');
    setErr(e);
    if (Object.keys(e).length) return;
    const body: Record<string, string> = {
      owner_name: v.owner_name.trim(),
      address: v.address.trim(),
      category: v.category.trim(),
      about: v.about.trim(),
      mobile: normMobile(v.mobile),
      email: v.email.trim(),
    };
    if (!appr) {
      body.shop_name = v.shop_name.trim();
      body.nid = v.nid.replace(/\s+/g, '');
      body.trade_no = v.trade_no.trim();
    }
    setBusy(true);
    try {
      setSeller(await updateMe(body));
      toast(t('saved'), 'ok');
      onClose();
    } catch (x) {
      setBusy(false);
      const f = errorField(x) as Key;
      if (f && f in v) setErr({ [f]: fieldText(x, t) });
      else toast(errorText(x, t), 'bad');
    }
  };

  return (
    <Sheet title={appr ? t('editProfile') : t('editApp')} onClose={onClose}>
      {!appr ? <Field label={t('shopName')} value={v.shop_name} onChangeText={set('shop_name')} autoCapitalize="words" maxLength={80} error={err.shop_name} /> : null}
      <Field label={t('ownerName')} value={v.owner_name} onChangeText={set('owner_name')} autoCapitalize="words" maxLength={100} error={err.owner_name} />
      <Field label={t('shopAddress')} value={v.address} onChangeText={set('address')} rows={3} maxLength={500} error={err.address} />
      <Field label={t('mainCategory')} value={v.category} onChangeText={set('category')} maxLength={120} />
      <Field label={t('aboutYourShop')} value={v.about} onChangeText={set('about')} rows={3} maxLength={1000} />
      {appr ? <Banner tone="warn">{t('needsApproval')}</Banner> : null}
      <Field label={t('mobile')} value={v.mobile} onChangeText={set('mobile')} keyboardType="phone-pad" maxLength={16} error={err.mobile} />
      <Field label={t('email')} value={v.email} onChangeText={set('email')} keyboardType="email-address" maxLength={190} error={err.email} />
      {!appr ? <Field label={t('nidNumber')} value={v.nid} onChangeText={set('nid')} keyboardType="number-pad" maxLength={30} error={err.nid} /> : null}
      {!appr ? <Field label={t('tradeNumber')} value={v.trade_no} onChangeText={set('trade_no')} maxLength={80} /> : null}
      <Button label={t('save')} busy={busy} onPress={() => void save()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}
