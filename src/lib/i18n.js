// The site in two languages: English (the default, at the root) and French (under /fr/).
// The words of the interactive parts are written in English in the code; `L('English text')` gives the French text of
// the page's language when it has one. `{name}` in a text is filled from the second argument: L('Layer {n}', { n: 2 }).
// The pages themselves come in French from scripts/import-wiki.mjs (wiki text) and src/content/docs/fr/ (written here).
import { FR } from './i18n-fr.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 'fr' or 'en', from the page's <html lang>; in an .astro file, pass the language to tr() instead. */
export const lang = () => (typeof document !== 'undefined' && document.documentElement.lang.startsWith('fr') ? 'fr' : 'en');

/** The text in language `lng`, with its `{name}` parts filled. */
export function tr(lng, en, vars) {
  const text = (lng === 'fr' && FR[en]) || en;
  return vars ? text.replace(/\{(\w+)\}/g, (all, k) => (k in vars ? vars[k] : all)) : text;
}
export const L = (en, vars) => tr(lang(), en, vars);

/** A number written the way the page's language writes it. */
export const num = (n, opts) => n.toLocaleString(lang() === 'fr' ? 'fr-FR' : 'en-US', opts);

/** The address of a page of the wiki (`overview`, `guides/remote-mining`) in the page's language. */
export const pageUrl = (page, lng = lang()) => `${BASE}${lng === 'fr' ? '/fr' : ''}/${page}/`;

/** A data file made by the import, in the page's language when it has one (blocks.json, recipes.json). */
export const dataUrl = (file, lng = lang()) => `${BASE}/data/${lng === 'fr' ? file.replace(/\.json$/, '.fr.json') : file}`;
