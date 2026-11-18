import { Image } from 'expo-image';
import { View } from 'react-native';

import type { Severity } from '@/data/guides';
import { usePalette } from '@/theme';

/** Soft tinted tile behind each illustration, keyed to how serious the situation is. */
const TINT: Record<Severity | 'tool', { light: string; dark: string }> = {
  critical: { light: '#FFE4E6', dark: '#3B0A14' },
  urgent: { light: '#FEF3C7', dark: '#3A2606' },
  care: { light: '#DCFCE7', dark: '#0B2E1A' },
  tool: { light: '#E0F2FE', dark: '#0C2A3D' },
};

export function ArtTile({ source, size = 52, kind = 'tool' }: { source: number; size?: number; kind?: Severity | 'tool' }) {
  const c = usePalette();
  const dark = c.bg === '#09090B';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: TINT[kind][dark ? 'dark' : 'light'],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={source} style={{ width: size * 0.72, height: size * 0.72 }} contentFit="contain" accessibilityIgnoresInvertColors />
    </View>
  );
}
