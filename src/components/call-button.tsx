import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { art } from '@/data/art';

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
      <View style={[styles.iconWrap, compact && { width: 40, height: 40 }]}>
        <Image source={art.phone} style={{ width: compact ? 22 : 30, height: compact ? 22 : 30 }} accessibilityIgnoresInvertColors />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  compact: { padding: 14, borderRadius: 18 },
  kicker: { color: '#FFE4E6', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  note: { color: '#FFE4E6', fontSize: 13, marginTop: 2 },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
});
