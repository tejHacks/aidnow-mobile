import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CallButton } from '@/components/call-button';
import { Body, Button, Card, Label, Screen } from '@/components/ui';
import { uid, useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

const FIVE_MIN = 5 * 60;

interface SeizureLog {
  id: string;
  startedAt: number;
  seconds: number;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Times a seizure, alerts at 5 minutes, and keeps a log for caregivers/doctors. */
export default function SeizureTimer() {
  const c = usePalette();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [log, setLog] = useStoredState<SeizureLog[]>('seizure-log', []);
  const alerted = useRef(false);

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [startedAt]);

  const seconds = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const overdue = seconds >= FIVE_MIN;

  useEffect(() => {
    if (overdue && !alerted.current) {
      alerted.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  }, [overdue]);

  const start = () => {
    alerted.current = false;
    setNow(Date.now());
    setStartedAt(Date.now());
  };
  const stop = () => {
    if (startedAt) setLog((l) => [{ id: uid(), startedAt, seconds }, ...l].slice(0, 50));
    setStartedAt(null);
  };

  return (
    <Screen>
      <View style={[styles.clock, { backgroundColor: overdue ? c.danger : c.card, borderColor: overdue ? c.danger : c.border }]}>
        <Text style={[styles.time, { color: overdue ? '#fff' : c.text }]}>{fmt(seconds)}</Text>
        <Text style={{ color: overdue ? '#FFE4E6' : c.muted, fontWeight: '600' }}>
          {overdue ? 'Over 5 minutes. Call emergency now' : startedAt ? 'Seizure in progress' : 'Tap start when the seizure begins'}
        </Text>
      </View>

      {overdue ? <CallButton /> : null}

      {startedAt ? <Button big variant="secondary" title="Seizure stopped" onPress={stop} /> : <Button big title="Start timer" onPress={start} />}

      <Card>
        <Label>While you wait</Label>
        <Body>• Move hard objects away and cushion their head.</Body>
        <Body>• Don&apos;t hold them down or put anything in their mouth.</Body>
        <Body>• When the jerking stops, roll them onto their side.</Body>
      </Card>

      {log.length ? (
        <Card>
          <Label>Recent seizures</Label>
          {log.slice(0, 10).map((e) => (
            <Body key={e.id}>
              {new Date(e.startedAt).toLocaleString()} · {fmt(e.seconds)}
            </Body>
          ))}
          <Body muted style={{ fontSize: 13 }}>Share these times with their doctor.</Body>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  clock: { borderWidth: 1, borderRadius: 28, paddingVertical: 36, alignItems: 'center', gap: 6 },
  time: { fontSize: 76, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
