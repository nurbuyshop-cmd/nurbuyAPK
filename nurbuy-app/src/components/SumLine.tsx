import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { Txt } from './Txt';

/** "Label ........ value" row of an order summary. */
export function SumLine({ label, value, green, bold }: { label: string; value: string; green?: boolean; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Txt weight={bold ? 'bold' : 'regular'} size={bold ? 16 : 14} color={bold ? colors.text : '#444'} style={styles.flex}>{label}</Txt>
      <Txt weight="bold" size={bold ? 16 : 14} color={green ? '#12a150' : colors.text}>{value}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, gap: 10 },
  flex: { flex: 1, minWidth: 0 },
});
