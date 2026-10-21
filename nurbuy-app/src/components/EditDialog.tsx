import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View, type TextInputProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Field } from './Field';
import { Txt } from './Txt';

export type DialogField = { key: string; label: string; value?: string; password?: boolean; multiline?: boolean } & Pick<TextInputProps, 'keyboardType' | 'autoComplete' | 'placeholder' | 'maxLength'>;

type Props = {
  title: string;
  fields: DialogField[];
  /** returns an error text to show, or '' when saved */
  onSave: (values: Record<string, string>) => Promise<string> | string;
  onClose: () => void;
};

/** Bottom sheet with one or more labelled fields and a Save button. Mount it to open it. */
export function EditDialog({ title, fields, onSave, onClose }: Props) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, f.value ?? ''])));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    setErr('');
    const e = await onSave(Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, v.trim()])));
    setBusy(false);
    if (e) setErr(e);
    else onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('close')} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <Txt weight="bold" size={18} style={styles.title}>{title}</Txt>
          {fields.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              value={vals[f.key]}
              onChangeText={(v) => setVals((s) => ({ ...s, [f.key]: v }))}
              password={f.password}
              multiline={f.multiline}
              keyboardType={f.keyboardType}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              maxLength={f.maxLength}
              style={f.multiline ? styles.multi : undefined}
            />
          ))}
          {err ? <Txt weight="semibold" size={13.5} color={colors.danger} style={styles.err}>{err}</Txt> : null}
          <Button label={t('save')} onPress={() => void save()} busy={busy} />
          <Button label={t('cancel')} variant="link" onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20 },
  title: { marginBottom: 12 },
  multi: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
  err: { marginBottom: 8 },
});
