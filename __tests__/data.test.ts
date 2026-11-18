import { art } from '@/data/art';
import { emergencyNumberFor } from '@/data/emergency-numbers';
import { getGuide, guideArt, guides } from '@/data/guides';

describe('first-aid guides', () => {
  it('has unique ids', () => {
    const ids = guides.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(guides.map((g) => [g.id, g] as const))('%s is complete and has an illustration', (_id, g) => {
    expect(g.title.length).toBeGreaterThan(3);
    expect(g.summary.length).toBeGreaterThan(10);
    expect(g.steps.length).toBeGreaterThanOrEqual(3);
    expect(g.callWhen.length).toBeGreaterThanOrEqual(1);
    expect(guideArt(g.id)).toBeDefined();
  });

  it('covers the core emergencies people search for', () => {
    for (const id of ['cpr', 'seizure', 'fainting', 'choking', 'choking-baby', 'bleeding', 'burns', 'allergy', 'stroke', 'heart-attack']) {
      expect(getGuide(id)).toBeDefined();
    }
  });

  it('tells you to call immediately for every life-threatening situation', () => {
    for (const g of guides.filter((x) => x.severity === 'critical')) {
      const text = [...g.steps, ...g.callWhen].join(' ').toLowerCase();
      expect(text).toMatch(/call emergency|immediately/);
    }
  });

  it('keeps critical safety rules in the seizure guide', () => {
    const seizure = getGuide('seizure')!;
    expect(seizure.dont?.join(' ')).toMatch(/hold them down/i);
    expect(seizure.dont?.join(' ')).toMatch(/anything in their mouth/i);
    expect(seizure.callWhen.join(' ')).toMatch(/5 minutes/);
    expect(seizure.tool).toBe('seizure-timer');
  });

  it('never suggests abdominal thrusts for babies', () => {
    const baby = getGuide('choking-baby')!;
    expect(baby.steps.join(' ')).not.toMatch(/abdominal thrust/i);
    expect(baby.dont?.join(' ')).toMatch(/abdominal thrusts/i);
  });

  it('has tool and onboarding art', () => {
    for (const k of ['tool-cpr', 'tool-timer', 'tool-medical-id', 'onboard-calm', 'onboard-offline', 'onboard-call'] as const) {
      expect(art[k]).toBeDefined();
    }
  });
});

describe('emergency numbers', () => {
  it.each([
    ['NG', '112'],
    ['US', '911'],
    ['GB', '999'],
    ['AU', '000'],
    ['JP', '119'],
    ['DE', '112'],
  ])('%s → %s', (region, number) => {
    expect(emergencyNumberFor(region).ambulance).toBe(number);
  });

  it('falls back to 112 (works on GSM networks worldwide) for unknown or missing regions', () => {
    expect(emergencyNumberFor('ZZ').ambulance).toBe('112');
    expect(emergencyNumberFor(undefined).ambulance).toBe('112');
  });

  it('mentions Lagos’s local number for Nigeria', () => {
    expect(emergencyNumberFor('NG').note).toMatch(/767/);
  });
});
