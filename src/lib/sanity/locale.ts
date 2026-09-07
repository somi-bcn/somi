export const locales = ['ca', 'es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ca';

/** URL prefix for a locale. The default locale is unprefixed at `/`. */
export function localePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}`;
}

type IntlEntry = { _key: string; language: string; value?: string | null };

/** Pick a single locale's value out of an internationalizedArray field,
 *  falling back to the default locale and then the first entry. */
export function pickLocale(field: IntlEntry[] | null | undefined, locale: Locale): string {
  if (!Array.isArray(field)) return '';
  const match = field.find((entry) => entry.language === locale);
  if (match?.value) return match.value;
  const fallback = field.find((entry) => entry.language === defaultLocale);
  return fallback?.value ?? field[0]?.value ?? '';
}
