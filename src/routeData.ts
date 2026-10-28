// "On this page" also lists the parts of a page drawn outside its Markdown: the refinery's "How to build it" (PageTitle.astro).
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { tr } from './lib/i18n.js';

export const onRequest = defineRouteMiddleware(context => {
  const route = context.locals.starlightRoute;
  const { toc, entry, lang } = route;
  if (!toc || entry.data.machine?.id !== 'ore_refinery_controller') return;
  toc.items.splice(1, 0, { depth: 2, slug: 'how-to-build-it', text: tr(lang === 'fr' ? 'fr' : 'en', 'How to build it'), children: [] });
});
