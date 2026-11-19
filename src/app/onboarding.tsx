import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { art } from '@/data/art';
import { useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

export const slides = [
  {
    key: 'calm',
    art: art['onboard-calm'],
    title: 'Stay calm.\nWe’ll guide you.',
    body: 'Clear, step-by-step help for seizures, fainting, choking, bleeding, burns and more.',
  },
  {
    key: 'offline',
    art: art['onboard-offline'],
    title: 'Works anywhere,\neven with no signal.',
    body: 'Every guide, the CPR coach and the seizure timer live on your phone. No data needed.',
  },
  {
    key: 'call',
    art: art['onboard-call'],
    title: 'One tap to help.',
    body: 'AidNow knows your country’s emergency number. Add your Medical ID so responders know what matters.',
  },
] as const;

/** Three quick slides, shown once. Skippable at any time. */
export default function Onboarding() {
  const c = usePalette();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [, setOnboarded] = useStoredState('onboarded', false);
  const list = useRef<FlatList>(null);
  const last = index === slides.length - 1;

  const finish = (thenMedicalId = false) => {
    setOnboarded(true);
    router.replace('/');
    if (thenMedicalId) router.push('/medical-id');
  };

  const next = () => {
    if (last) return finish();
    list.current?.scrollToIndex({ index: index + 1, animated: true });
    setIndex(index + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.top}>
        <Text style={[styles.brand, { color: c.primary }]}>AidNow</Text>
        {!last ? (
          <Pressable onPress={() => finish()} accessibilityRole="button" hitSlop={12}>
            <Text style={{ color: c.muted, fontSize: 16, fontWeight: '600' }}>Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={list}
        data={slides}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]} accessible accessibilityLabel={`${item.title.replace('\n', ' ')} ${item.body}`}>
            <Image source={item.art} style={styles.art} contentFit="contain" />
            <Text style={[styles.title, { color: c.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: c.muted }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Step ${index + 1} of ${slides.length}`}>
          {slides.map((s, i) => (
            <View key={s.key} style={[styles.dot, { backgroundColor: i === index ? c.primary : c.border, width: i === index ? 24 : 8 }]} />
          ))}
        </View>
        <Button big title={last ? 'Get started' : 'Next'} onPress={next} />
        {last ? <Button title="Set up my Medical ID" variant="secondary" onPress={() => finish(true)} /> : <View style={{ height: 52 }} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, height: 44 },
  brand: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  slide: { paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center', gap: 16 },
  art: { width: '100%', aspectRatio: 4 / 3, maxHeight: 300 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6, textAlign: 'center', lineHeight: 36 },
  body: { fontSize: 17, lineHeight: 25, textAlign: 'center', maxWidth: 340 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  dot: { height: 8, borderRadius: 4 },
});
