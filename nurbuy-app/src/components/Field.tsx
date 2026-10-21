import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt, useInputFont } from './Txt';

type Props = TextInputProps & { label: string; password?: boolean };

/** Labelled input in the website's auth-form style; password fields get a show/hide eye. */
export const Field = forwardRef<TextInput, Props>(function Field({ label, password, style, ...rest }, ref) {
  const t = useT();
  const font = useInputFont();
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <View style={styles.wrap}>
      <Txt weight="bold" size={13} color="#333" style={styles.label}>{label}</Txt>
      <View>
        <TextInput
          ref={ref}
          placeholderTextColor="#9aa1b8"
          secureTextEntry={password && !show}
          autoCapitalize="none"
          {...rest}
          onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          style={[styles.input, { fontFamily: font }, focus && styles.focus, password && styles.pwPad, style]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={show ? t('authHidePw') : t('authShowPw')}
            onPress={() => setShow((v) => !v)}
            style={styles.eye}
            hitSlop={4}
          >
            <Icon name={show ? 'eyeOff' : 'eye'} size={22} color="#7b8ab8" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 13 },
  label: { marginBottom: 6 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#dfe3f1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15.5,
    backgroundColor: '#fafbff',
    color: '#111',
  },
  focus: { borderColor: '#3a56f0', backgroundColor: colors.white },
  pwPad: { paddingRight: 52 },
  eye: { position: 'absolute', right: 3, top: 3, width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
});
