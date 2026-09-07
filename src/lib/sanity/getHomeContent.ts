import { sanityClient } from 'sanity:client';

import { homeContentQuery, type HomeContent } from './queries';

const token = import.meta.env.SANITY_API_READ_TOKEN;

/** Fetch the home page singleton. In preview mode we read drafts with the
 *  read token and turn on stega so Visual Editing overlays can map values
 *  back to their fields; otherwise we hit the CDN with published content. */
export async function getHomeContent(preview: boolean): Promise<HomeContent | null> {
  const client = preview
    ? sanityClient.withConfig({
        token,
        useCdn: false,
        perspective: 'drafts',
        stega: { enabled: true, studioUrl: '/admin' },
      })
    : sanityClient;

  return client.fetch<HomeContent | null>(homeContentQuery);
}
