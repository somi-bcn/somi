// Seed the `homePage` singleton with the starting copy from resources/Website.pdf.
//
//   pnpm seed:sanity      (== node --env-file=.env scripts/seed-content.mjs)
//
// Every internationalizedArray field is filled with the same English text in all
// three locale slots (ca / es / en) so nothing renders empty before translation.
// Translation then happens in the Studio, one locale at a time, no code changes.
// Re-running overwrites the document, so translated text WILL be lost — this is a
// one-time bootstrap, not a sync.
//
// Needs SANITY_API_WRITE_TOKEN (Editor). Never add that token to Netlify.

import { createClient } from '@sanity/client';

import { projectId, dataset } from '../sanity.constants.ts';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('SANITY_API_WRITE_TOKEN is not set. Run with: pnpm seed:sanity');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-11-01',
  token,
  useCdn: false,
});

const LOCALES = ['ca', 'es', 'en'];

const intl = (type, text) =>
  LOCALES.map((lang) => ({ _key: crypto.randomUUID(), _type: type, language: lang, value: text }));
const str = (text) => intl('internationalizedArrayStringValue', text);
const txt = (text) => intl('internationalizedArrayTextValue', text);

const heroSubheading = `somi is a new community space for radical tenderness in Raval, Barcelona. It's a place to reconnect with your creativity, your body, and a community. It is available for workshops, talks, events, exhibitions, screenings and anything else that might bring people together. It is a living lab exploring how hope and courage can emerge simply through being present with others, and how healing, when it happens collectively, can become an act of resistance.`;

const ethosBody = [
  `If you're tired of hearing "it doesn't matter, we're f**ed" — and you deeply believe that things can and must change, somi is for you.`,
  `somi is an oasis for radical tenderness in Raval. A place to slow down, reconnect with your body, your creativity, and a community. To rest, create, and gather, to be fully present.`,
  `At somi, we believe that coming back to ourselves is a political act. That by reconnecting with our bodies, rediscovering our creativity and meeting a community, we can leave more present, less reactive and start to act from a place of care rather than fear.`,
  `In a time where selfcare and wellbeing are sold as individual activities, at somi we want to make healing a collective responsibility. We believe that you cannot heal yourself if the source of your suffering is systemic. But at somi we don't just heal for the sake of healing, we seek to become better within and amongst ourselves to reconnect with a sense of hopefulness. We believe that by connecting to our creativity through a workshop, by moving our bodies during a concert and most importantly by joining a community, we can release the assumptions that we're powerless individuals. At the core of our ethos is interconnectedness, between mind and body, between different types of humans, and between us and the natural world.`,
  `We don't see tenderness, vulnerability or care as passive or weak. We see them as resistance. Instead of reproducing the dominant codes of performance, productivity and competition, we practice something different: presence, connection, and the radical belief that another way of being together is possible.`,
].join('\n\n');

const activitiesBody = `Somi can host a variety of activities from workshops, talks, screenings, exhibitions, concerts, therapies. The space comprises of three modules, a main studio space, a mezzanine and a patio. It also has a full bathroom and kitchen. The rates depend on the type of activity and there are many options available.`;

const joinBody = `Somi is not only a community space, but it will also be an association and a living lab. We are establishing a membership subscription which will allow members to get involved however they would like. Whether you have a project you'd like to propose, or you want to help shape the direction of somi we would love to hear from you!`;

const residencyBody = `During the off season or when there are no events programmed, somi is available as an artistic residency for creators, explorers, weavers who would like to find a little oasis in the heart of Barcelona.`;

const aboutBody = [
  `Somi was founded by Caro Biotteau after leaving a career in the energy transition, where she witnessed many of her dedicated peers — herself included — sacrificing their physical and mental wellbeing to "save the world," only to cycle through burnout and disillusionment.`,
  `Having lived most of her life with chronic pain conditions — endometriosis and adenomyosis — Caro has always been wired with the stubborn belief that things can get better. During her years in the energy sector, she pushed her body to keep up with the system's rhythm. When she couldn't anymore, she blamed herself — until she realised it wasn't her fault. The system itself was broken.`,
  `When she stepped away to focus on rebuilding her health, something shifted. She noticed that the mainstream approach to wellbeing places all responsibility on the individual to heal, while the roots of that suffering are systemic. Individual solutions to collective problems. Somi is her response to that. A space where healing is understood as a collective act — not a personal project. She will also be pursuing research in collective healing and radical tenderness, using Somi as a living laboratory for what a different way of being together might look like.`,
].join('\n\n');

const doc = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    heading: str('A space for radical tenderness in the heart of Raval'),
    subheading: txt(heroSubheading),
  },
  ethos: {
    heading: str('Ethos'),
    body: txt(ethosBody),
  },
  activities: {
    heading: str('Activities'),
    body: txt(activitiesBody),
  },
  join: {
    heading: str('Join'),
    body: txt(joinBody),
    cta: str('Enquire'),
  },
  residency: {
    heading: str('Artistic Residency'),
    body: txt(residencyBody),
  },
  about: {
    heading: str('About'),
    body: txt(aboutBody),
  },
};

await client.createOrReplace(doc);

// Drop any leftover draft so the Studio doesn't keep showing stale content.
await client.delete('drafts.homePage').catch((err) => {
  if ((err?.statusCode ?? err?.response?.statusCode) !== 404) throw err;
});

console.log('Seeded homePage. Open the Studio to review and translate.');
