import groq from 'groq';

/** One entry of an `internationalizedArray` field: the locale is on `language`,
 *  `_key` is a random id. */
export type IntlArray = { _key: string; language: string; value?: string | null }[] | null;

export const homeContentQuery = groq`*[_type == "homePage"][0]{
  hero{ heading, subheading },
  ethos{ heading, body },
  activities{ heading, body },
  join{ heading, body, cta },
  residency{ heading, body },
  about{ heading, body }
}`;

export interface HomeContent {
  hero: { heading: IntlArray; subheading: IntlArray } | null;
  ethos: { heading: IntlArray; body: IntlArray } | null;
  activities: { heading: IntlArray; body: IntlArray } | null;
  join: { heading: IntlArray; body: IntlArray; cta: IntlArray } | null;
  residency: { heading: IntlArray; body: IntlArray } | null;
  about: { heading: IntlArray; body: IntlArray } | null;
}
