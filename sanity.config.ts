import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { languageFilter } from '@sanity/language-filter';
import { projectId, dataset, locales } from './sanity.constants';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const languageConfig = locales.map((l) => ({ id: l.id, title: l.title }));

export default defineConfig({
  projectId,
  dataset,
  name: 'somi',
  title: 'Somi Studio',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    internationalizedArray({
      languages: languageConfig,
      defaultLanguages: ['ca'],
      fieldTypes: ['string', 'text'],
    }),
    languageFilter({
      supportedLanguages: languageConfig,
      defaultLanguages: ['ca'],
      documentTypes: ['homePage', 'siteSettings', 'event'],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
