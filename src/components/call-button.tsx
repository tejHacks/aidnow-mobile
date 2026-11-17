import { Pressable, StyleSheet, Text, View } from 'react-native';

import { callNumber, useEmergencyNumber } from '@/lib/emergency';
import { usePalette } from '@/theme';

/** Big, always-visible emergency call button with the country-aware number. */
export function CallButton({ compact }: { compact?: boolean }) {
  const c = usePalette();
  const { ambulance, note, region } = useEmergencyNumber();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Call emergency services on ${ambulance}`}
      onPress={() => callNumber(ambulance)}
      style={({ pressed }) => [styles.btn, compact && styles.compact, { backgroundColor: c.danger, opacity: pressed ? 0.85 : 1 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.kicker}>Emergency{region ? ` · ${region}` : ''}</Text>
        <Text style={[styles.title, compact && { fontSize: 20 }]}>Call {ambulance}</Text>
        {note && !compact ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <Text style={styles.icon}>📞</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  compact: { padding: 14, borderRadius: 18 },
  kicker: { color: '#FFE4E6', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  note: { color: '#FFE4E6', fontSize: 13, marginTop: 2 },
  icon: { fontSize: 34 },
});
