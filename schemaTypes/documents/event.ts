import { defineField, defineType } from 'sanity';

type LocalizedValue = { _key: string; value: string };

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. 18:00 – 20:00',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. 15€ / Gratuït',
    }),
    defineField({
      name: 'facilitator',
      title: 'Facilitator',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
    prepare(selected: Record<string, unknown>) {
      const title = selected['title'] as LocalizedValue[] | undefined;
      const subtitle = selected['subtitle'] as string | undefined;
      const label =
        Array.isArray(title)
          ? (title.find((t) => t._key === 'ca')?.value ?? title[0]?.value ?? 'Untitled')
          : 'Untitled';
      return { title: label, subtitle };
    },
  },
});
