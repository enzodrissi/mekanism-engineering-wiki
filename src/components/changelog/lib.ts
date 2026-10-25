// Shared by the pieces of the visual release notes (src/changelog/*.mdx). Every picture they show is a file the site already
// has: the item icons drawn from the mod's models (public/icons/), the wiki's screenshots (public/wiki-images/) and the
// CurseForge gallery (public/gallery/), all brought in by scripts/import-wiki.mjs and scripts/render-icons.mjs.
import fs from 'node:fs';
import path from 'node:path';

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const PUB = path.join(process.cwd(), 'public');

/** The icon of an item: `ore_refinery_casing` (this mod) or `mekanism:steel_casing`, `minecraft:iron_ingot`. */
export const icon = (id: string) => {
  const [ns, p] = id.includes(':') ? id.split(':') : ['mekanismengineering', id];
  return `${BASE}/icons/${ns}/${p}.png`;
};
export const hasIcon = (id: string) => {
  const [ns, p] = id.includes(':') ? id.split(':') : ['mekanismengineering', id];
  return fs.existsSync(path.join(PUB, 'icons', ns, p + '.png'));
};

/** A file of the site's public folder, under the site's base path. */
export const asset = (p: string) => `${BASE}/${p.replace(/^\//, '')}`;

/** A data file made by the import (blocks.json, recipes.json) in the page's language; {} when the import has not run. */
export function data(file: string, lng: string) {
  const name = lng === 'fr' ? file.replace(/\.json$/, '.fr.json') : file;
  try { return JSON.parse(fs.readFileSync(path.join(PUB, 'data', name), 'utf8')); } catch { return {}; }
}

/** The page's language, from Starlight. */
export const langOf = (astro: any): 'en' | 'fr' => (astro.locals.starlightRoute?.lang === 'fr' ? 'fr' : 'en');
