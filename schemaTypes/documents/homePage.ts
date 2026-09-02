import { defineField, defineType } from 'sanity';

const section = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
) =>
  defineField({
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields,
  });

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    section('hero', 'Hero', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'subheading',
        title: 'Subheading',
        type: 'internationalizedArrayText',
      }),
    ]),
    section('ethos', 'Ethos', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
      }),
    ]),
    section('activities', 'Activities', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
      }),
    ]),
    section('join', 'Join', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
      }),
      defineField({
        name: 'cta',
        title: 'CTA Label',
        type: 'internationalizedArrayString',
      }),
    ]),
    section('residency', 'Artistic Residency', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
      }),
    ]),
    section('about', 'About', [
      defineField({
        name: 'heading',
        title: 'Heading',
        type: 'internationalizedArrayString',
      }),
      defineField({
        name: 'body',
        title: 'Body',
        type: 'internationalizedArrayText',
      }),
    ]),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
});
