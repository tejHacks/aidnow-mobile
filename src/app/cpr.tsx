import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { CallButton } from '@/components/call-button';
import { Body, Button, Pill, Row, Screen } from '@/components/ui';
import { usePalette } from '@/theme';

const BPM = 110; // within the recommended 100–120 compressions per minute
const INTERVAL = Math.round(60000 / BPM);

/** CPR metronome: a visual + haptic beat, with an optional 30:2 cycle prompt. */
export default function CprCoach() {
  const c = usePalette();
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<'hands-only' | '30:2'>('hands-only');
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      pulse.setValue(1.18);
      Animated.timing(pulse, { toValue: 1, duration: INTERVAL - 60, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      setCount((n) => n + 1);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [running, pulse]);

  const inCycle = mode === '30:2' ? count % 30 : count;
  const breathsDue = mode === '30:2' && count > 0 && count % 30 === 0;

  return (
    <Screen>
      <CallButton compact />
      <Row style={{ justifyContent: 'center' }}>
        <Pill active={mode === 'hands-only'} onPress={() => setMode('hands-only')}>Hands-only</Pill>
        <Pill active={mode === '30:2'} onPress={() => setMode('30:2')}>30 : 2 (trained)</Pill>
      </Row>

      <View style={styles.stage}>
        <Animated.View style={[styles.heart, { backgroundColor: c.primary, transform: [{ scale: pulse }] }]}>
          <Text style={styles.count}>{mode === '30:2' ? (breathsDue ? '2' : inCycle) : count}</Text>
          <Text style={styles.sub}>{breathsDue ? 'rescue breaths' : mode === '30:2' ? 'of 30' : 'compressions'}</Text>
        </Animated.View>
      </View>

      <Body muted style={{ textAlign: 'center' }}>
        Push hard and fast in the centre of the chest, 5–6 cm deep, on every beat ({BPM} per minute). Let the chest rise fully between pushes.
      </Body>

      <Button
        big
        title={running ? 'Pause' : count ? 'Resume' : 'Start compressions'}
        variant={running ? 'secondary' : 'primary'}
        onPress={() => setRunning((r) => !r)}
      />
      {count > 0 && !running ? <Button title="Reset" variant="secondary" onPress={() => setCount(0)} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  heart: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center' },
  count: { color: '#fff', fontSize: 72, fontWeight: '800', fontVariant: ['tabular-nums'] },
  sub: { color: '#FFE4E6', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
