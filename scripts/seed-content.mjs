// Seed the `homePage` singleton with the copy from resources/website.pdf.
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

// ─── Hero ────────────────────────────────────────────────────────────────────

const heroTagline = `Connection · Community · Creativity`;

const heroHeading = `A space for radical tenderness in the heart of Raval`;

const heroLede = [
  `SOMI is an oasis for radical tenderness in Raval. A place to slow down, to create, to experiment, gather, and to be fully present.`,
  `If you're tired of hearing the defeatist's "it doesn't matter, we're fucked" and instead you deeply believe that things can and must change, SOMI is for you. It is a place to reconnect with your creativity, your body, and a community. It is a living lab exploring how we can relate differently to others, and how healing, when tackled collectively, can become an act of resistance. It is available for workshops, talks, events, exhibitions, screenings and anything else that might bring people together.`,
].join('\n\n');

// ─── Ethos ───────────────────────────────────────────────────────────────────

const ethosBody = [
  `At SOMI, we believe that all of this "self-care", health optimization, and wellness crap that's been popularized over the last few years are just another way to keep us self-obsessed and separated. The underlying assumption is probably true: most of us are worried about the future, are hurting, mentally, physically, and are looking for ways out. But all of these trends are just selling more individual solutions to a collective problem.`,
  `At SOMI we want to make healing a collective responsibility. We believe that you cannot heal by yourself if the source of your suffering is systemic. We believe that by connecting to others during a workshop, by moving our bodies during a concert, and most importantly, by joining a community, we can stop feeling like we're powerless individuals. Because at SOMI we don't just heal for the sake of healing, we do it as a political act: to reconnect with hope and ask for change.`,
  `This is where radical tenderness comes in. For us, this is the art of choosing care and peace over violence and doom. It doesn't mean staying passive; it means that you find strength in softness and resilience in vulnerability. Our hope with SOMI is that you leave our walls feeling more present, more connected, less reactive and ready to act from a place of care rather than fear or anxiety.`,
  `Radical tenderness is a concept which has emerged from Mexico, first coined by the transfeminist activist Lia Garcia and then explored by Dani D'Emilia.`,
].join('\n\n');

// ─── Activities ──────────────────────────────────────────────────────────────

const activitiesBody = [
  `At SOMI we believe that there are many ways of getting out of our heads and start connecting with others. We can host a variety of activities from workshops, talks, screenings, exhibitions to concerts and therapies.`,
  `We welcome proposals from anyone whether you are an individual, collective, organization, or independent initiative who has a project aligned with our ethos and wants to collaborate, showcase, or program with us.`,
  `The rates depend on the type of activity, please contact us for more information.`,
].join('\n\n');

// ─── Join ─────────────────────────────────────────────────────────────────────

const joinBody = [
  `SOMI is not only a community space, but also an association and a living lab. We are establishing a membership subscription which will allow members to get involved however they would like. By joining, members may participate in shaping the project, help develop the program and access benefits like the co-working space.`,
  `Whether you have a project you'd like to propose, or you want to help shape the direction of SOMI we would love to hear from you!`,
].join('\n\n');

// ─── Residency ───────────────────────────────────────────────────────────────

const residencyBody = `During the off season or when there are no events programmed, SOMI is available as an artistic residency for creators, explorers, weavers who would like to find a little oasis in the heart of Barcelona.`;

// ─── About ───────────────────────────────────────────────────────────────────

const aboutBody = [
  `SOMI was founded by Caro Biotteau after leaving a career in the energy transition. For years, she witnessed her colleagues sacrificing their physical and mental wellbeing to "save the planet," only to go from burnout to disillusionment. Living with chronic pain from endometriosis and adenomyosis, she also constantly had to push her body to keep up with the system's rhythm and blamed herself when she failed.`,
  `When she decided to quit everything to focus on her health, things finally made sense. She realized that the mainstream approach to wellbeing places all of the responsibility on the individual, while the roots of the illnesses are almost always systemic. It's when she started feeling connected again to her body, to her creativity and to a community that she finally started leaving her physical and mental sufferings behind. With SOMI she wants to provide a safe space for people who feel deeply.`,
  `With a background in Environmental Governance and International Economic Policy, Caro will also be pursuing research in ecofeminism, studying radical tenderness and collective healing.`,
].join('\n\n');

// ─── Document ────────────────────────────────────────────────────────────────

const doc = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    tagline: str(heroTagline),
    heading: str(heroHeading),
    lede: txt(heroLede),
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

// Drop any leftover draft so the Studio doesn't show stale content.
await client.delete('drafts.homePage').catch((err) => {
  if ((err?.statusCode ?? err?.response?.statusCode) !== 404) throw err;
});

console.log('Seeded homePage. Open the Studio to review and translate.');
