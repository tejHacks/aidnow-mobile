import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ArtTile } from '@/components/art-tile';
import { CallButton } from '@/components/call-button';
import { Body, Button, Card, H1, Label, Screen } from '@/components/ui';
import { Image } from 'expo-image';

import { art } from '@/data/art';
import { getGuide, guideArt } from '@/data/guides';
import { scenes } from '@/data/scenes';
import { usePalette } from '@/theme';

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = getGuide(id);
  const c = usePalette();

  if (!guide) {
    return (
      <Screen>
        <Body>Guide not found.</Body>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: guide.title }} />
      <View style={{ gap: 6 }}>
        <ArtTile source={guideArt(guide.id)} kind={guide.severity} size={84} />
        <H1>{guide.title}</H1>
        <Body muted>{guide.summary}</Body>
      </View>

      {guide.severity === 'critical' ? <CallButton compact /> : null}

      {guide.tool === 'cpr' ? <Button title="Open CPR coach (110 bpm)" onPress={() => router.push('/cpr')} /> : null}
      {guide.tool === 'seizure-timer' ? <Button title="Start seizure timer" onPress={() => router.push('/seizure-timer')} /> : null}

      {guide.signs ? (
        <Card>
          <Label>Signs to look for</Label>
          {guide.signs.map((s) => (
            <Body key={s}>• {s}</Body>
          ))}
        </Card>
      ) : null}

      <View style={{ gap: 10 }}>
        <Label>What to do</Label>
        {scenes[guide.id] ? (
          <Image
            source={scenes[guide.id].image}
            style={[styles.scene, { borderColor: c.border }]}
            contentFit="cover"
            accessibilityLabel={scenes[guide.id].alt}
            accessibilityIgnoresInvertColors
          />
        ) : null}
        {guide.steps.map((step, i) => (
          <View key={i} style={[styles.step, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.num, { backgroundColor: c.primary }]}>
              <Text style={styles.numText}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: c.text }]}>{step}</Text>
          </View>
        ))}
      </View>

      {guide.dont ? (
        <Card style={{ borderColor: c.danger }}>
          <Label style={{ color: c.danger }}>Don&apos;t</Label>
          {guide.dont.map((d) => (
            <View key={d} style={styles.dont}>
              <Image source={art.dont} style={{ width: 20, height: 20, marginTop: 2 }} accessibilityIgnoresInvertColors />
              <Body style={{ flex: 1 }}>{d}</Body>
            </View>
          ))}
        </Card>
      ) : null}

      <Card>
        <Label>Call emergency if</Label>
        {guide.callWhen.map((w) => (
          <Body key={w}>• {w}</Body>
        ))}
      </Card>

      {guide.severity !== 'critical' ? <CallButton compact /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scene: { width: '100%', aspectRatio: 1.6, borderRadius: 22, borderWidth: 1 },
  step: { flexDirection: 'row', gap: 14, padding: 16, borderRadius: 18, borderWidth: 1, alignItems: 'flex-start' },
  num: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  numText: { color: '#fff', fontWeight: '800' },
  stepText: { flex: 1, fontSize: 18, lineHeight: 26 },
  dont: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
});
