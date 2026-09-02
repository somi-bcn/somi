import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
