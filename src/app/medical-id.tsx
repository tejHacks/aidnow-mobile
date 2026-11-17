import { router } from 'expo-router';
import { useState } from 'react';

import { Body, Button, Field, Screen } from '@/components/ui';
import { emptyMedicalId, useMedicalId, type MedicalId } from '@/lib/emergency';

const fields: { key: keyof MedicalId; label: string; placeholder: string; phone?: boolean; multi?: boolean }[] = [
  { key: 'name', label: 'Name', placeholder: 'Full name' },
  { key: 'bloodType', label: 'Blood type', placeholder: 'e.g. O+' },
  { key: 'allergies', label: 'Allergies', placeholder: 'e.g. penicillin, peanuts', multi: true },
  { key: 'conditions', label: 'Medical conditions', placeholder: 'e.g. epilepsy, asthma, diabetes', multi: true },
  { key: 'medications', label: 'Medications', placeholder: 'Name and dose', multi: true },
  { key: 'contactName', label: 'Emergency contact name', placeholder: 'e.g. Mum' },
  { key: 'contactPhone', label: 'Emergency contact phone', placeholder: '+234…', phone: true },
];

/** Medical ID stored only on this device. */
export default function MedicalIdScreen() {
  const [saved, save, ready] = useMedicalId();
  // Mount the form only once stored data has loaded, so it starts from it.
  if (!ready) return <Screen>{null}</Screen>;
  return <MedicalIdForm initial={saved} onSave={save} />;
}

function MedicalIdForm({ initial, onSave }: { initial: MedicalId; onSave: (m: MedicalId) => void }) {
  const [draft, setDraft] = useState<MedicalId>({ ...emptyMedicalId, ...initial });

  return (
    <Screen>
      <Body muted>Fill this in before you need it. It stays on this phone and helps responders help you.</Body>
      {fields.map((f) => (
        <Field
          key={f.key}
          label={f.label}
          placeholder={f.placeholder}
          value={draft[f.key]}
          multiline={f.multi}
          keyboardType={f.phone ? 'phone-pad' : 'default'}
          onChangeText={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
        />
      ))}
      <Button
        title="Save"
        onPress={() => {
          onSave(draft);
          router.back();
        }}
      />
    </Screen>
  );
}
