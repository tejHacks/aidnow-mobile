import { art, type ArtKey } from './art';

/**
 * First-aid guides. Content follows widely published lay-rescuer guidance
 * (Red Cross / St John Ambulance / AHA style). It must be reviewed by a
 * qualified clinician and localised before any public release.
 */
export type Severity = 'critical' | 'urgent' | 'care';

export interface Guide {
  id: string;
  title: string;
  severity: Severity;
  summary: string;
  signs?: string[];
  steps: string[];
  dont?: string[];
  callWhen: string[];
  tool?: 'cpr' | 'seizure-timer';
  keywords: string;
}

export const guides: Guide[] = [
  {
    id: 'cpr',
    title: 'Not breathing (CPR)',
    severity: 'critical',
    summary: 'Someone is unresponsive and not breathing normally.',
    steps: [
      'Check it is safe for you to approach.',
      'Tap their shoulders and shout. If no response and they are not breathing normally, call emergency now. Put the phone on speaker.',
      'Send someone for an AED (defibrillator) if one is nearby.',
      'Kneel beside them. Put the heel of one hand in the centre of the chest, other hand on top, fingers interlocked.',
      'Push hard and fast: 5 to 6 cm deep, 100 to 120 times a minute. Let the chest come all the way back up between pushes.',
      'If you are trained, give 2 rescue breaths after every 30 compressions. If not, keep doing hands-only compressions.',
      'As soon as the AED arrives, switch it on and follow its voice prompts.',
      'Keep going until help takes over, the person starts breathing normally, or you are too exhausted to continue.',
    ],
    callWhen: ['Immediately, before you start CPR.'],
    tool: 'cpr',
    keywords: 'cardiac arrest heart stopped collapse unconscious resuscitation aed',
  },
  {
    id: 'seizure',
    title: 'Seizure / epilepsy',
    severity: 'urgent',
    summary: 'Jerking movements, stiffening, or loss of awareness.',
    steps: [
      'Stay calm and start the seizure timer.',
      'Move hard or sharp objects away from them.',
      'Cushion their head with something soft, like a folded jacket.',
      'Loosen anything tight around the neck and remove glasses.',
      'When the jerking stops, gently roll them onto their side (recovery position).',
      'Stay with them. Speak calmly and reassure them as they wake up.',
    ],
    dont: [
      "Don't hold them down or try to stop the movements.",
      "Don't put anything in their mouth.",
      "Don't give food or drink until they are fully alert.",
    ],
    callWhen: [
      'The seizure lasts longer than 5 minutes.',
      'Another seizure starts soon after the first.',
      "They don't wake up fully, or they have trouble breathing afterwards.",
      "It's their first seizure, they are injured, pregnant, or it happened in water.",
    ],
    tool: 'seizure-timer',
    keywords: 'epilepsy fit convulsion shaking jerking',
  },
  {
    id: 'fainting',
    title: 'Fainting',
    severity: 'care',
    summary: 'Brief loss of consciousness, often after dizziness or feeling hot.',
    signs: ['Dizziness or light-headedness', 'Pale, sweaty skin', 'Blurred vision or ringing ears'],
    steps: [
      'If they feel faint: help them lie down, or sit with their head between their knees.',
      'If they have fainted: lay them on their back and raise their legs about 30 cm (if not injured).',
      'Check they are breathing normally. If not, start CPR.',
      'Loosen tight clothing and get fresh air to them.',
      'They should wake up within a minute or two. Help them sit up slowly.',
      'If they stay unresponsive but are breathing, put them in the recovery position.',
    ],
    callWhen: [
      "They don't wake up within 1 or 2 minutes.",
      'They were injured when they fell.',
      'They have chest pain, a racing or irregular heartbeat, or trouble breathing.',
      'They fainted during exercise, are pregnant, or it keeps happening.',
    ],
    keywords: 'faint collapse passed out dizzy syncope',
  },
  {
    id: 'choking',
    title: 'Choking (adult or child)',
    severity: 'critical',
    summary: "They can't breathe, cough or speak. They may be holding their throat.",
    steps: [
      'Ask "Are you choking?" If they can cough, encourage them to keep coughing.',
      'If they cannot cough, speak or breathe: lean them forward and give up to 5 firm back blows between the shoulder blades with the heel of your hand.',
      'If that fails: stand behind them, put a fist just above the belly button, grab it with your other hand, and pull sharply in and up. Do this up to 5 times (abdominal thrusts).',
      'Keep alternating 5 back blows and 5 abdominal thrusts.',
      'If they become unresponsive, lower them to the ground, call emergency and start CPR.',
    ],
    callWhen: [
      'The blockage does not clear after 3 rounds.',
      'Always get them checked after abdominal thrusts.',
    ],
    keywords: 'choke food stuck throat heimlich airway',
  },
  {
    id: 'choking-baby',
    title: 'Choking (baby under 1)',
    severity: 'critical',
    summary: 'A baby is unable to cry, cough or breathe.',
    steps: [
      'Shout for help. Ask someone to call emergency services while you start.',
      'Lay the baby face down along your forearm, head lower than their bottom, supporting the jaw.',
      'Give up to 5 firm back blows between the shoulder blades with the heel of your hand.',
      'Turn them face up along your arm. Put two fingers in the centre of the chest, just below the nipple line, and give up to 5 sharp chest thrusts.',
      'Look in the mouth and take out anything you can see. Never poke your finger in blindly.',
      'Repeat back blows and chest thrusts. If they become unresponsive, start infant CPR.',
    ],
    dont: ["Don't use abdominal thrusts on a baby."],
    callWhen: [
      'Call emergency now if the blockage does not clear after 3 rounds. Keep going while you call on speaker.',
      'Call immediately if the baby becomes unresponsive, then start infant CPR.',
    ],
    keywords: 'infant newborn baby choke',
  },
  {
    id: 'bleeding',
    title: 'Severe bleeding',
    severity: 'critical',
    summary: 'Heavy bleeding that will not stop.',
    steps: [
      'Call emergency for heavy bleeding.',
      'Press firmly on the wound with a clean cloth or dressing. Keep pressing.',
      'If blood soaks through, add more cloth on top. Do not take off the first layer.',
      'If something is stuck in the wound, leave it in and press around it.',
      'Help them lie down if they feel faint, and keep them warm.',
      'If you are trained and have one, use a tourniquet for life-threatening bleeding from an arm or leg.',
    ],
    callWhen: ['Bleeding is heavy, spurting, or not slowing after 10 minutes of pressure.'],
    keywords: 'blood cut wound haemorrhage hemorrhage',
  },
  {
    id: 'burns',
    title: 'Burns',
    severity: 'urgent',
    summary: 'Heat, chemical or electrical burns.',
    steps: [
      'Make sure the danger has stopped. For electrical burns, switch off the power first.',
      'Cool the burn under cool or lukewarm running water for 20 minutes.',
      "Remove jewellery and clothing near the burn, unless it's stuck to the skin.",
      'Cover loosely with cling film or a clean, non-fluffy cloth.',
      'Keep the person warm.',
    ],
    dont: ["Don't use ice, butter, toothpaste or creams.", "Don't burst blisters."],
    callWhen: [
      'The burn is larger than their hand, or deep.',
      'It is on the face, hands, feet or genitals.',
      'It is chemical or electrical, or they breathed in smoke.',
      'The person is a baby, child or older adult.',
    ],
    keywords: 'burn scald fire hot water chemical electric',
  },
  {
    id: 'allergy',
    title: 'Severe allergic reaction',
    severity: 'critical',
    summary: 'Anaphylaxis. It can become life-threatening within minutes.',
    signs: ['Swelling of the lips, tongue or throat', 'Difficulty breathing or wheezing', 'Pale, floppy or collapsing', 'Widespread rash'],
    steps: [
      'Call emergency.',
      'If they have an adrenaline auto-injector (like an EpiPen), help them use it on the outer thigh.',
      'Lie them down with legs raised. If breathing is hard, let them sit up instead.',
      'If there is no improvement after 5 minutes and they have a second auto-injector, use it.',
      'If they become unresponsive and stop breathing normally, start CPR.',
    ],
    callWhen: ['Immediately for any signs of anaphylaxis.'],
    keywords: 'anaphylaxis allergy epipen swelling bee sting peanut',
  },
  {
    id: 'asthma',
    title: 'Asthma attack',
    severity: 'urgent',
    summary: 'Wheezing, coughing and struggling to breathe.',
    steps: [
      'Help them sit upright and lean slightly forward. Stay calm.',
      'Help them use their reliever inhaler (usually blue): 1 puff every 30 to 60 seconds, up to 10 puffs. Use a spacer if they have one.',
      'Loosen tight clothing.',
      'If they are no better after 10 puffs, call emergency. If help has not arrived in 10 minutes, repeat the puffs.',
    ],
    dont: ["Don't lie them down."],
    callWhen: ['No improvement after 10 puffs, or they are too breathless to speak.'],
    keywords: 'asthma inhaler wheeze breathing',
  },
  {
    id: 'stroke',
    title: 'Stroke: think FAST',
    severity: 'critical',
    summary: 'Sudden face drooping, arm weakness or slurred speech.',
    signs: ['Face: one side drooping', 'Arms: can they lift both?', 'Speech: slurred or confused', 'Time: call emergency now'],
    steps: [
      'Call emergency straight away.',
      'Note the time the symptoms started. Doctors will ask.',
      'Keep them comfortable and reassured.',
      "Don't give them food or drink.",
      'If they become unresponsive but are breathing, put them in the recovery position.',
    ],
    callWhen: ['Immediately. Every minute matters.'],
    keywords: 'stroke face arm speech fast brain',
  },
  {
    id: 'heart-attack',
    title: 'Heart attack',
    severity: 'critical',
    summary: 'Chest pain or pressure that may spread to arms, jaw, neck or back.',
    signs: ['Crushing chest pain or pressure', 'Breathlessness', 'Sweating, nausea, feeling of doom'],
    steps: [
      'Call emergency.',
      'Help them sit down in a comfortable, half-sitting position.',
      "If they are an adult, not allergic, and haven't been told to avoid it, give one 300 mg aspirin to chew slowly.",
      'If they have angina medication, help them take it.',
      'Stay with them. If they become unresponsive and stop breathing normally, start CPR.',
    ],
    callWhen: ['Immediately.'],
    keywords: 'heart attack chest pain cardiac',
  },
  {
    id: 'heat-stroke',
    title: 'Heat stroke',
    severity: 'urgent',
    summary: 'Very high body temperature, confusion, hot skin.',
    steps: [
      'Call emergency.',
      'Move them to a cool, shaded place and remove extra clothing.',
      'Cool them quickly: wet their skin with cool water and fan them. Put cold packs on the neck, armpits and groin.',
      'If they are alert and can swallow, give sips of cool water.',
    ],
    dont: ["Don't give drinks if they are confused or drowsy."],
    callWhen: ['Confusion, collapse, or a temperature of 40°C (104°F) or more.'],
    keywords: 'heat stroke hot sun temperature dehydration',
  },
  {
    id: 'low-sugar',
    title: 'Low blood sugar',
    severity: 'urgent',
    summary: 'Hypoglycaemia. It is common in people with diabetes.',
    signs: ['Shaky, sweaty, pale', 'Confused or irritable', 'Hungry, drowsy'],
    steps: [
      'If they can swallow safely, give fast sugar: glucose tablets, fruit juice, regular (not diet) soft drink or sweets.',
      'Wait 15 minutes. If they are still unwell, give more.',
      'Once they feel better, give a snack like bread or biscuits.',
    ],
    dont: ["Don't give anything by mouth if they are drowsy or unresponsive. Put them in the recovery position instead."],
    callWhen: ["They don't improve, become drowsy or unresponsive, or can't swallow."],
    keywords: 'diabetes hypo sugar glucose insulin',
  },
  {
    id: 'recovery',
    title: 'Recovery position',
    severity: 'care',
    summary: 'For someone unresponsive but breathing normally.',
    steps: [
      'Kneel beside them. Place the arm nearest you at a right angle, palm up.',
      'Bring their far arm across the chest and hold the back of their hand against their near cheek.',
      'Bend their far knee up.',
      'Pull on that knee to roll them towards you onto their side.',
      'Tilt their head back gently to keep the airway open.',
      'Keep checking their breathing until help arrives.',
    ],
    callWhen: ['Anyone who is unresponsive needs emergency help.'],
    keywords: 'recovery position unconscious breathing side',
  },
  {
    id: 'nosebleed',
    title: 'Nosebleed',
    severity: 'care',
    summary: 'Bleeding from the nose.',
    steps: [
      'Sit them down and lean them forward, not back.',
      'Pinch the soft part of the nose firmly for 10 to 15 minutes. Do not let go.',
      'Breathe through the mouth and spit out any blood.',
    ],
    callWhen: ['Bleeding lasts more than 20 to 30 minutes, is very heavy, or follows a head injury.'],
    keywords: 'nose bleed epistaxis',
  },
  {
    id: 'fracture',
    title: 'Broken bone or sprain',
    severity: 'urgent',
    summary: 'Pain, swelling, deformity after a fall or blow.',
    steps: [
      "If you think the neck or back is hurt, don't move them. Call emergency.",
      'Support the injured part in the position you found it. Pad around it.',
      'Apply a cold pack wrapped in cloth for up to 20 minutes.',
      'Watch for signs of shock: pale, cold, clammy skin. Keep them warm.',
    ],
    callWhen: ['Bone is visible, limb is deformed, pain is severe, or there may be a neck or back injury.'],
    keywords: 'broken bone fracture sprain fall',
  },
  {
    id: 'poisoning',
    title: 'Poisoning',
    severity: 'urgent',
    summary: 'Swallowed, inhaled or touched something harmful.',
    steps: [
      'Call emergency or your poison centre.',
      'Find out what they took, how much, and when. Keep the container.',
      'If it is on the skin: remove contaminated clothing and rinse with water for 15 to 20 minutes.',
      'If they are unresponsive but breathing, use the recovery position.',
    ],
    dont: ["Don't make them vomit."],
    callWhen: ['For any suspected poisoning.'],
    keywords: 'poison overdose chemical swallow',
  },
];

export const getGuide = (id: string) => guides.find((g) => g.id === id);

/** Every guide's illustration lives in assets/aid/<id>.png. */
export const guideArt = (id: string) => art[id as ArtKey];
