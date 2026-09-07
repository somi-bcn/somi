import type { APIRoute } from 'astro';

import { clearPreviewCookie } from '../../../lib/sanity/preview';

/** Clears the preview cookie and returns to the page (or `/`). */
export const GET: APIRoute = ({ cookies, redirect, request }) => {
  clearPreviewCookie(cookies);
  const redirectTo = new URL(request.url).searchParams.get('redirect') || '/';
  return redirect(redirectTo);
};
