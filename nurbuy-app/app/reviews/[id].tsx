import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { fetchReviews, postReview, type Reviews } from '@/api/reviews';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { RatingSummary, ReviewRow } from '@/components/ReviewParts';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { errorText } from '@/lib/errors';
import { productName } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { useAuth } from '@/store/auth';
import { useCatalog } from '@/store/catalog';
import { digits, useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, radius, shadow, TOUCH } from '@/theme';

const PAGE = 15;

/** All reviews of a product, filtered by stars, and the review form for customers who received it. */
export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const idx = useIndex();
  const p = idx && id ? idx.byId.get(id) : undefined;
  const q = useQuery({ queryKey: ['reviews', id], queryFn: () => fetchReviews(id ?? ''), enabled: !!id });
  const [filter, setFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [shown, setShown] = useState(PAGE);

  const rv = q.data;
  const list = rv ? rv.list.filter((r) => !filter || r.stars === filter) : [];

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title={t('ratingsReviews')} sub={p ? productName(p, lang) : undefined} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!rv ? (
          <ActivityIndicator color={colors.primary} style={styles.load} />
        ) : (
          <>
            <View style={styles.card}>
              {rv.count ? <RatingSummary rv={rv} /> : <Txt size={14} color="#8a8f9c">{t('noReviews')}</Txt>}
            </View>
            {id ? <ReviewForm pid={id} rv={rv} /> : null}
            {rv.count ? (
              <View style={styles.card}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                  {([0, 5, 4, 3, 2, 1] as const).map((n) => (
                    <Pressable
                      key={n}
                      onPress={() => {
                        setFilter(n);
                        setShown(PAGE);
                      }}
                      style={[styles.chip, filter === n && styles.chipOn]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: filter === n }}
                    >
                      {n ? <Icon name="star" size={13} color={filter === n ? colors.white : colors.primary} /> : null}
                      <Txt weight="semibold" size={13} color={filter === n ? colors.white : colors.text}>{n ? digits(n, lang) : t('all')}</Txt>
                    </Pressable>
                  ))}
                </ScrollView>
                {list.slice(0, shown).map((r, i) => <ReviewRow key={i} r={r} />)}
                {list.length > shown ? <Button label={t('loadMore')} variant="outline" onPress={() => setShown((s) => s + PAGE)} /> : null}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ReviewForm({ pid, rv }: { pid: string; rv: Reviews }) {
  const t = useT();
  const font = useInputFont();
  const status = useAuth((s) => s.status);
  const qc = useQueryClient();
  const [stars, setStars] = useState(rv.mine?.stars ?? 0);
  const [text, setText] = useState(rv.mine?.text ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (status !== 'user') return null;
  if (!rv.can && !rv.mine) {
    return (
      <View style={styles.card}>
        <Txt size={13.5} color={colors.grey}>{t('onlyReceivers')}</Txt>
      </View>
    );
  }

  const submit = async () => {
    if (stars < 1) return setErr(t('chooseStars'));
    setErr('');
    setBusy(true);
    try {
      const fresh = await postReview(pid, stars, text.trim());
      qc.setQueryData(['reviews', pid], fresh);
      void useCatalog.getState().refreshRatings();
      toast(t('thanksReview'));
    } catch (e) {
      setErr(errorText(e, t));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.card}>
      <Txt weight="bold" size={15}>{rv.mine ? t('yourReview') : t('reviewThis')}</Txt>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setStars(n)} style={styles.starBtn} accessibilityRole="radio" accessibilityState={{ selected: n <= stars }} accessibilityLabel={`${n}`}>
            <Icon name="star" size={30} color={n <= stars ? colors.primary : '#d5d9e6'} />
          </Pressable>
        ))}
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t('reviewPh')}
        placeholderTextColor="#9aa1b8"
        multiline
        maxLength={1000}
        textAlignVertical="top"
        style={[styles.input, { fontFamily: font }]}
      />
      {err ? <Txt size={13} color={colors.danger}>{err}</Txt> : null}
      <Button label={rv.mine ? t('updateReview') : t('submitReview')} onPress={submit} busy={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  load: { marginTop: 40 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginHorizontal: 12, marginTop: 10, gap: 10, ...shadow.card },
  chips: { gap: 8, paddingBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  stars: { flexDirection: 'row', gap: 4 },
  starBtn: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 90, borderWidth: 1.5, borderColor: '#dfe3f1', borderRadius: 12, padding: 12, fontSize: 15, color: colors.text },
});
