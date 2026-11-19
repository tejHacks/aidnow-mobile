import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { Linking } from 'react-native';

import { resetStoredStateCache } from '@/lib/storage';

const APP = './src/app';

async function startOnboarded() {
  await AsyncStorage.setItem('onboarded', 'true');
  await renderRouter(APP, { initialUrl: '/' });
  await screen.findByText('All emergencies');
}

beforeEach(async () => {
  await AsyncStorage.clear();
  resetStoredStateCache();
  jest.useRealTimers();
});

describe('onboarding', () => {
  it('shows on first launch and Skip goes straight to the guides', async () => {
    await renderRouter(APP, { initialUrl: '/' });
    expect(await screen.findByText(/Stay calm/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Skip'));
    expect(await screen.findByText('All emergencies')).toBeOnTheScreen();
    expect(await AsyncStorage.getItem('onboarded')).toBe('true');
  });

  it('does not show again once completed', async () => {
    await startOnboarded();
    expect(screen.queryByText(/Stay calm/)).toBeNull();
  });
});

describe('home', () => {
  it('lists every guide with the emergency call button', async () => {
    await startOnboarded();
    expect(screen.getByLabelText(/Call emergency services on/)).toBeOnTheScreen();
    expect(screen.getByText('Seizure / epilepsy')).toBeOnTheScreen();
    expect(screen.getByText('Fainting')).toBeOnTheScreen();
  });

  it('search narrows the list by keyword', async () => {
    await startOnboarded();
    await fireEvent.changeText(screen.getByLabelText('Search first-aid guides'), 'fit');
    expect(await screen.findByText('Seizure / epilepsy')).toBeOnTheScreen();
    expect(screen.queryByText('Fainting')).toBeNull();
    expect(screen.getByText('1 result')).toBeOnTheScreen();
  });

  it('shows a safe fallback when nothing matches', async () => {
    await startOnboarded();
    await fireEvent.changeText(screen.getByLabelText('Search first-aid guides'), 'zzzz');
    expect(await screen.findByText(/call emergency services now/)).toBeOnTheScreen();
  });

  it('places a call when the emergency button is pressed', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await startOnboarded();
    await fireEvent.press(screen.getByLabelText(/Call emergency services on/));
    await waitFor(() => expect(open).toHaveBeenCalledWith(expect.stringMatching(/^tel:\d+$/)));
  });
});

describe('guide', () => {
  it('opens a guide with numbered steps and the right tool', async () => {
    await startOnboarded();
    await fireEvent.press(screen.getByLabelText(/^Seizure \/ epilepsy/));
    expect(await screen.findByText('Start seizure timer')).toBeOnTheScreen();
    expect(screen.getByText(/Cushion their head/)).toBeOnTheScreen();
    expect(screen.getByText(/put anything in their mouth/)).toBeOnTheScreen();
  });
});

describe('medical ID', () => {
  it('saves an emergency contact and shows it on the home screen', async () => {
    await startOnboarded();
    await fireEvent.press(screen.getByLabelText('Medical ID'));
    await fireEvent.changeText(await screen.findByPlaceholderText('e.g. Mum'), 'Mum');
    await fireEvent.changeText(screen.getByPlaceholderText('+234…'), '+2348000000000');
    await fireEvent.press(screen.getByText('Save'));
    expect(await screen.findByText(/Call Mum · \+2348000000000/)).toBeOnTheScreen();
  });
});

describe('seizure timer', () => {
  it('warns to call emergency after 5 minutes', async () => {
    await renderRouter(APP, { initialUrl: '/seizure-timer' });
    jest.useFakeTimers({ now: Date.UTC(2026, 10, 18, 10, 0, 0) });
    await fireEvent.press(await screen.findByText('Start timer'));
    expect(screen.getByText('Seizure in progress')).toBeOnTheScreen();

    await act(async () => {
      jest.setSystemTime(Date.UTC(2026, 10, 18, 10, 5, 1));
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/Over 5 minutes. Call emergency now/)).toBeOnTheScreen();
  });
});

describe('CPR coach', () => {
  it('counts compressions at about 110 per minute', async () => {
    await renderRouter(APP, { initialUrl: '/cpr' });
    jest.useFakeTimers();
    await fireEvent.press(await screen.findByText('Start compressions'));
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    const count = Number(screen.getByText(/^\d+$/).props.children);
    expect(count).toBeGreaterThanOrEqual(105);
    expect(count).toBeLessThanOrEqual(115);
  });
});
