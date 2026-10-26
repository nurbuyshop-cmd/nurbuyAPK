import { Switch as RNSwitch } from 'react-native';

import { colors } from '@/theme';

/** On/off switch in the brand colours. */
export function Switch({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: '#d5d9e6', true: '#9fb0ff' }}
      thumbColor={value ? colors.primary : '#f4f5f9'}
    />
  );
}
