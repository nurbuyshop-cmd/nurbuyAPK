import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/api';
import { newProductCode, product, saveProduct, type Product } from '@/api/products';
import { Button } from '@/components/Button';
import { BasicCard, DescCard, PriceCard, SpecsCard, StatusNote, TagsCard } from '@/components/pf/FormCards';
import { PhotosCard } from '@/components/pf/PhotosCard';
import { VariantManager } from '@/components/pf/VariantManager';
import { VariantSetup } from '@/components/pf/VariantSetup';
import { VariantStockSheet } from '@/components/StockSheets';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, Spinner } from '@/components/ui';
import { errorText, fieldText } from '@/lib/errors';
import { checkProductForm } from '@/lib/productForm';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { usePForm } from '@/store/pform';
import { useProducts } from '@/store/products';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

const FORM_FIELDS = ['name', 'bn', 'pcode', 'cat', 'price', 'old', 'stock', 'max_q', 'tags', 'imgs'];

/** Add (id "new") or edit a product (website scrPEdit()). */
export default function ProductForm() {
  const { t } = useLang();
  const { id = 'new' } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const ready = usePForm((s) => s.ready);
  const type = usePForm((s) => s.type);
  const p = usePForm((s) => s.p);
  const [error, setError] = useState<unknown>(null);
  const [tries, setTries] = useState(0);
  const [busy, setBusy] = useState(false);
  const [gen, setGen] = useState('');
  const [quick, setQuick] = useState(false);

  useEffect(() => {
    let live = true;
    usePForm.getState().reset();
    (async () => {
      try {
        const meta = await useProducts.getState().loadMeta();
        const [prod, code] = await Promise.all([isNew ? Promise.resolve(null) : product(Number(id)), isNew ? newProductCode() : Promise.resolve('')]);
        if (live) usePForm.getState().init(prod, code, meta);
      } catch (e) {
        if (live) setError(e);
      }
    })();
    return () => {
      live = false;
      usePForm.getState().reset();
    };
  }, [id, isNew, tries]);

  const submit = async () => {
    setGen('');
    const r = checkProductForm(t);
    if (!r.ok) {
      if (r.msg) toast(t(r.msg), 'bad', 4500);
      return;
    }
    const s = usePForm.getState();
    const wasActive = s.p?.status === 'active';
    setBusy(true);
    try {
      const saved = await saveProduct(s.id, r.body);
      useProducts.getState().put(saved);
      if (!s.id) useProducts.getState().setFilter('pending');
      void useProducts.getState().load();
      void useDash.getState().load().catch(() => {});
      toast(!s.id ? t('pSubmitted') : wasActive ? t('pSavedLive') : t('saved'), 'ok', 4500);
      if (router.canGoBack()) router.back();
      else router.replace('/products');
    } catch (e) {
      setBusy(false);
      const field = e instanceof ApiError ? e.field : undefined;
      if (field === 'pcode' && e instanceof ApiError && e.status === 409) {
        usePForm.setState({ errs: { ...usePForm.getState().errs, pcode: t('pcodeTaken') } });
        toast(t('pcodeTaken'), 'bad', 5000);
      } else if (field && FORM_FIELDS.includes(field)) {
        const m = fieldText(e, t);
        usePForm.setState({ errs: { ...usePForm.getState().errs, [field]: m } });
        toast(m, 'bad', 5000);
      } else {
        const m = e instanceof ApiError && e.field === 'vr' && e.error ? e.error : errorText(e, t);
        setGen(m);
        toast(m, 'bad', 5000);
      }
    }
  };

  // stock / on-off of a live product's variants, saved at once without a review
  const quickSaved = (np: Product) => {
    useProducts.getState().put(np);
    const live = np.vr?.v ?? [];
    usePForm.setState({
      p: np,
      vars: usePForm.getState().vars.map((x) => {
        const m = live.find((y) => y.id === x.id);
        return m ? { ...x, stock: String(m.stock), on: m.on } : x;
      }),
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title={isNew ? t('addProductT') : t('editProductT')} back backTo="/products" />
      {!ready ? (
        error ? (
          <ErrorBox
            error={error}
            onRetry={() => {
              setError(null);
              setTries((x) => x + 1);
            }}
          />
        ) : (
          <Spinner />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <StatusNote />
          {p && p.status === 'active' && p.vr?.v.length ? (
            <Card title={t('quickStock')}>
              <Txt size={13} color={colors.grey} style={styles.sub}>{t('quickStockSub')}</Txt>
              <Button variant="secondary" icon="box" label={t('updateVarStock')} onPress={() => setQuick(true)} />
            </Card>
          ) : null}
          <PhotosCard />
          <BasicCard />
          <PriceCard />
          <DescCard />
          <TagsCard />
          <SpecsCard />
          {type === 'var' ? (
            <>
              <VariantSetup />
              <VariantManager />
            </>
          ) : null}
          {gen ? <Banner tone="bad">{gen}</Banner> : null}
          <View style={styles.btns}>
            <Button label={p ? t('saveChanges') : t('submitReview')} busy={busy} onPress={() => void submit()} />
            <Button label={t('cancel')} variant="secondary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/products'))} />
          </View>
        </ScrollView>
      )}
      {quick && p ? <VariantStockSheet p={p} onClose={() => setQuick(false)} onSaved={quickSaved} /> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 40 },
  sub: { marginBottom: 10 },
  btns: { gap: 10, marginTop: 4 },
});
