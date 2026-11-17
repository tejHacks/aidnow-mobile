/**
 * Emergency numbers by ISO region code. 112 is the fallback: it works on
 * GSM mobile networks in most of the world, including many countries below.
 * Always verify numbers for your launch markets before release.
 */
export interface EmergencyNumber {
  ambulance: string;
  note?: string;
}

const numbers: Record<string, EmergencyNumber> = {
  NG: { ambulance: '112', note: 'Lagos: 767 or 112' },
  GH: { ambulance: '112', note: 'Ambulance: 193' },
  KE: { ambulance: '999', note: 'Also 112' },
  ZA: { ambulance: '10177', note: 'From a mobile: 112' },
  EG: { ambulance: '123' },
  US: { ambulance: '911' },
  CA: { ambulance: '911' },
  MX: { ambulance: '911' },
  BR: { ambulance: '192' },
  GB: { ambulance: '999', note: 'Also 112' },
  IE: { ambulance: '112', note: 'Also 999' },
  AU: { ambulance: '000', note: 'From a mobile: 112' },
  NZ: { ambulance: '111' },
  IN: { ambulance: '112', note: 'Ambulance: 108' },
  JP: { ambulance: '119' },
  CN: { ambulance: '120' },
  AE: { ambulance: '998', note: 'Police: 999' },
  SA: { ambulance: '997' },
};

const EU = ['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'PT', 'SE', 'DK', 'FI', 'PL', 'AT', 'GR', 'CZ', 'RO', 'HU'];

export function emergencyNumberFor(region?: string | null): EmergencyNumber {
  if (!region) return { ambulance: '112' };
  if (numbers[region]) return numbers[region];
  if (EU.includes(region)) return { ambulance: '112' };
  return { ambulance: '112', note: 'Check your local emergency number' };
}
