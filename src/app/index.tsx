import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArtTile } from '@/components/art-tile';
import { CallButton } from '@/components/call-button';
import { art } from '@/data/art';
import { guideArt, guides, type Severity } from '@/data/guides';
import { callNumber, useMedicalId } from '@/lib/emergency';
import { useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

const severityLabel: Record<Severity, string> = {
  critical: 'Life-threatening',
  urgent: 'Urgent',
  care: 'First aid',
};

const tools = [
  { label: 'CPR coach', art: art['tool-cpr'], href: '/cpr' as const },
  { label: 'Seizure timer', art: art['tool-timer'], href: '/seizure-timer' as const },
  { label: 'Medical ID', art: art['tool-medical-id'], href: '/medical-id' as const },
];

export default function Home() {
  const c = usePalette();
  const [q, setQ] = useState('');
  const [medical] = useMedicalId();
  const [onboarded, , ready] = useStoredState('onboarded', false);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return guides;
    return guides.filter((g) => `${g.title} ${g.summary} ${g.keywords}`.toLowerCase().includes(term));
  }, [q]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  if (!onboarded) return <Redirect href="/onboarding" />;

  const sevColor = (s: Severity) => (s === 'critical' ? c.danger : s === 'urgent' ? '#D97706' : c.success);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} accessibilityLabel="AidNow" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: c.text }]}>AidNow</Text>
            <Text style={{ color: c.muted, fontSize: 13 }}>First aid anywhere. Works offline.</Text>
          </View>
        </View>

        <CallButton />

        {/* Tools */}
        <View style={styles.tools}>
          {tools.map((t) => (
            <Pressable
              key={t.label}
              accessibilityRole="button"
              accessibilityLabel={t.label}
              onPress={() => router.push(t.href)}
              style={({ pressed }) => [styles.tool, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1 }]}>
              <ArtTile source={t.art} size={48} />
              <Text style={[styles.toolText, { color: c.text }]} numberOfLines={2}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {medical.contactPhone ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => callNumber(medical.contactPhone)}
            style={[styles.contact, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={{ color: c.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>EMERGENCY CONTACT</Text>
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>
              Call {medical.contactName || 'contact'} · {medical.contactPhone}
            </Text>
          </Pressable>
        ) : null}

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="What's happening? e.g. seizure, choking"
          placeholderTextColor={c.subtle}
          accessibilityLabel="Search first-aid guides"
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={[styles.search, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        <Text style={[styles.section, { color: c.subtle }]}>{q ? `${list.length} result${list.length === 1 ? '' : 's'}` : 'All emergencies'}</Text>

        <View style={{ gap: 10 }}>
          {list.map((g) => (
            <Pressable
              key={g.id}
              accessibilityRole="button"
              accessibilityLabel={`${g.title}. ${severityLabel[g.severity]}. ${g.summary}`}
              onPress={() => router.push({ pathname: '/guide/[id]', params: { id: g.id } })}
              style={({ pressed }) => [styles.row, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1 }]}>
              <ArtTile source={guideArt(g.id)} kind={g.severity} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.rowTitle, { color: c.text }]}>{g.title}</Text>
                <Text style={{ color: c.muted, fontSize: 14, lineHeight: 19 }} numberOfLines={2}>
                  {g.summary}
                </Text>
                <View style={[styles.badge, { borderColor: sevColor(g.severity) }]}>
                  <Text style={{ color: sevColor(g.severity), fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>{severityLabel[g.severity].toUpperCase()}</Text>
                </View>
              </View>
              <Text style={{ color: c.subtle, fontSize: 22 }} accessibilityElementsHidden>
                ›
              </Text>
            </Pressable>
          ))}
          {list.length === 0 ? (
            <Text style={{ color: c.muted, fontSize: 15, lineHeight: 22 }}>No guide matches “{q}”. If you&apos;re unsure, call emergency services now.</Text>
          ) : null}
        </View>

        <Text style={{ color: c.subtle, fontSize: 12, lineHeight: 18 }}>
          AidNow gives general first-aid guidance and is not a substitute for professional medical help or a first-aid course. In an emergency, always
          call your local emergency number first.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingTop: 8, gap: 14, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  logo: { width: 44, height: 44, borderRadius: 12 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  tools: { flexDirection: 'row', gap: 10 },
  tool: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 6, borderRadius: 20, borderWidth: 1, minHeight: 112 },
  toolText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  contact: { borderRadius: 18, borderWidth: 1, padding: 14, gap: 4 },
  search: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  section: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 1 },
  rowTitle: { fontSize: 17, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 },
});
