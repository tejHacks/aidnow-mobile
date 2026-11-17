import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CallButton } from '@/components/call-button';
import { Body, Card, Label, Row, Screen } from '@/components/ui';
import { guides, type Severity } from '@/data/guides';
import { callNumber, useMedicalId } from '@/lib/emergency';
import { usePalette } from '@/theme';

const severityLabel: Record<Severity, string> = {
  critical: 'Life-threatening',
  urgent: 'Urgent',
  care: 'First aid',
};

export default function Home() {
  const c = usePalette();
  const [q, setQ] = useState('');
  const [medical] = useMedicalId();

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return guides;
    return guides.filter((g) => `${g.title} ${g.summary} ${g.keywords}`.toLowerCase().includes(term));
  }, [q]);

  const sevColor = (s: Severity) => (s === 'critical' ? c.danger : s === 'urgent' ? '#D97706' : c.success);

  return (
    <Screen>
      <CallButton />

      <Row style={{ gap: 10 }}>
        {[
          { label: 'CPR coach', emoji: '❤️', href: '/cpr' as const },
          { label: 'Seizure timer', emoji: '⏱️', href: '/seizure-timer' as const },
          { label: 'Medical ID', emoji: '🪪', href: '/medical-id' as const },
        ].map((t) => (
          <Card key={t.label} style={styles.tool} onPress={() => router.push(t.href)}>
            <Text style={{ fontSize: 26 }}>{t.emoji}</Text>
            <Text style={[styles.toolText, { color: c.text }]}>{t.label}</Text>
          </Card>
        ))}
      </Row>

      {medical.contactPhone ? (
        <Card onPress={() => callNumber(medical.contactPhone)}>
          <Label>Emergency contact</Label>
          <Body>
            Call {medical.contactName || 'contact'} · {medical.contactPhone}
          </Body>
        </Card>
      ) : null}

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="What's happening? e.g. seizure, choking, burn"
        placeholderTextColor={c.subtle}
        accessibilityLabel="Search first-aid guides"
        style={[styles.search, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
      />

      <View style={{ gap: 10 }}>
        {list.map((g) => (
          <Pressable
            key={g.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/guide/[id]', params: { id: g.id } })}
            style={({ pressed }) => [styles.row, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1 }]}>
            <Text style={styles.emoji}>{g.emoji}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.rowTitle, { color: c.text }]}>{g.title}</Text>
              <Text style={{ color: c.muted, fontSize: 14 }} numberOfLines={2}>
                {g.summary}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: sevColor(g.severity) }]}>
              <Text style={{ color: sevColor(g.severity), fontSize: 10, fontWeight: '800' }}>{severityLabel[g.severity].toUpperCase()}</Text>
            </View>
          </Pressable>
        ))}
        {list.length === 0 ? <Body muted>No guide matches “{q}”. If in doubt, call emergency.</Body> : null}
      </View>

      <Body muted style={{ fontSize: 13, lineHeight: 19 }}>
        AidNow gives general first-aid guidance and is not a substitute for professional medical help or a first-aid course. In an emergency,
        always call your local emergency number first.
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tool: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  toolText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  search: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1 },
  emoji: { fontSize: 28, width: 36, textAlign: 'center' },
  rowTitle: { fontSize: 17, fontWeight: '700' },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
});
