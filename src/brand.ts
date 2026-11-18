import { defineBrand } from './lib/brand-type';

export const brand = defineBrand({
  name: 'AidNow',
  colors: { primary: '#E11D48', primaryText: '#FFFFFF', accent: '#F43F5E' },
  screens: [
    { name: 'index', title: 'AidNow', hideHeader: true },
    { name: 'onboarding', title: '', hideHeader: true },
    { name: 'guide/[id]', title: '' },
    { name: 'cpr', title: 'CPR coach' },
    { name: 'seizure-timer', title: 'Seizure timer' },
    { name: 'medical-id', title: 'Medical ID', modal: true },
  ],
});
