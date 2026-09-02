export const projectId = '7baiygyd';
export const dataset = 'production';

export const locales = [
  { id: 'ca', title: 'Català' },
  { id: 'es', title: 'Español' },
  { id: 'en', title: 'English' },
] as const;

export type LocaleId = (typeof locales)[number]['id'];
