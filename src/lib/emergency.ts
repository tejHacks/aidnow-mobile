import { getLocales } from 'expo-localization';
import { Alert, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

import { emergencyNumberFor } from '@/data/emergency-numbers';
import { useStoredState } from '@/lib/storage';

export interface MedicalId {
  name: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  medications: string;
  contactName: string;
  contactPhone: string;
}

export const emptyMedicalId: MedicalId = {
  name: '',
  bloodType: '',
  allergies: '',
  conditions: '',
  medications: '',
  contactName: '',
  contactPhone: '',
};

export const useMedicalId = () => useStoredState<MedicalId>('medical-id', emptyMedicalId);

export function useEmergencyNumber() {
  const region = getLocales()[0]?.regionCode;
  return { region, ...emergencyNumberFor(region) };
}

export async function callNumber(number: string) {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  const url = `tel:${number.replace(/[^\d+]/g, '')}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to place call', `Dial ${number} on your phone.`);
  }
}
