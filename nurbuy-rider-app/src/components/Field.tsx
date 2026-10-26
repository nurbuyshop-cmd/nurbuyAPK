import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt, useInputFont } from './Txt';

type Props = TextInputProps & { label: string; password?: boolean; required?: boolean; hint?: string; error?: string; rows?: number };

/** Labelled input like the website's fld(): red line and message under it on an error; password fields get an eye. */
export const Field = forwardRef<TextInput, Props>(function Field({ label, password, required, hint, error, rows, style, ...rest }, ref) {
  const t = useT();
  const font = useInputFont();
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const multi = !!rows;
  return (
    <View style={styles.wrap}>
      <Txt weight="semibold" size={13.5} color="#333" style={styles.label}>
        {label}
        {required ? <Txt color={colors.danger}> *</Txt> : null}
      </Txt>
      <View>
        <TextInput
          ref={ref}
          placeholderTextColor="#9aa1b8"
          secureTextEntry={password && !show}
          autoCapitalize="none"
          multiline={multi}
          {...rest}
          onFocus={(e) => {
            setFocus(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            { fontFamily: font },
            multi && { height: 24 * rows + 26, paddingTop: 12, textAlignVertical: 'top' },
            focus && styles.focus,
            !!error && styles.bad,
            password && styles.pwPad,
            style,
          ]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('password')}
            onPress={() => setShow((v) => !v)}
            style={styles.eye}
            hitSlop={4}
          >
            <Icon name={show ? 'eyeOff' : 'eye'} size={21} color="#7b8ab8" />
          </Pressable>
        ) : null}
      </View>
      {hint ? <Txt size={12.5} color={colors.grey} style={styles.hint}>{hint}</Txt> : null}
      {error ? <Txt size={13} color={colors.danger} style={styles.hint} accessibilityRole="alert">{error}</Txt> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 13 },
  label: { marginBottom: 6 },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: '#dfe3f1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15.5,
    backgroundColor: '#fafbff',
    color: '#111',
  },
  focus: { borderColor: '#3a56f0', backgroundColor: colors.white },
  bad: { borderColor: colors.danger, backgroundColor: '#fffafa' },
  pwPad: { paddingRight: 52 },
  eye: { position: 'absolute', right: 3, top: 3, width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: 5 },
});
