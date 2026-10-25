// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import rehypeTables from './src/lib/rehype-tables.mjs';
import { SITE, BASE } from './site.config.mjs';

const sidebarFile = new URL('./src/data/sidebar.json', import.meta.url);
const machines = fs.existsSync(sidebarFile) ? JSON.parse(fs.readFileSync(sidebarFile, 'utf8')) : [];

// Visitor counter: GoatCounter (no cookies, no consent banner). Empty = no counter.
export const GOATCOUNTER = 'mekanism-engineering-wiki';

export default defineConfig({
  site: SITE,
  base: BASE || '/',
  trailingSlash: 'always',
  markdown: { rehypePlugins: [rehypeTables] },
  integrations: [
    starlight({
      title: 'Mekanism: Engineering',
      // English at the root, French under /fr/ (pages from scripts/import-wiki.mjs and src/content/docs/fr); a menu in the
      // header switches between them, and a page missing in French shows the English one with a notice
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' }, fr: { label: 'Français', lang: 'fr' } },
      description: 'The complete wiki of Mekanism: Engineering, an addon for Mekanism: remote mining, whole-chain ore refining, quantum networks and precise logistics.',
      logo: { src: './src/assets/logo.png', alt: 'Mekanism: Engineering' },
      favicon: '/favicon.png',
      social: [
        { icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/enzodr/mekanism-engineering' },
      ],
      customCss: [
        '@fontsource-variable/space-grotesk',
        '@fontsource-variable/inter',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/theme.css',
        './src/styles/motion.css',
      ],
      components: {
        Head: './src/components/Head.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      head: GOATCOUNTER ? [{
        tag: 'script',
        attrs: { 'data-goatcounter': `https://${GOATCOUNTER}.goatcounter.com/count`, async: true, src: 'https://gc.zgo.at/count.js' },
      }] : [],
      lastUpdated: false,
      // code blocks keep their lines (the refinery's layer drawing is a grid): a long line scrolls sideways
      expressiveCode: { defaultProps: { wrap: false } },
      pagination: true,
      sidebar: [
        {
          label: 'Start here', translations: { fr: 'Commencer ici' },
          items: [
            'overview',
            'getting-started',
            { label: 'Guides', translations: { fr: 'Tutos' }, items: [{ autogenerate: { directory: 'guides' } }] },
            'faq',
          ],
        },
        // one group per machine family, written by scripts/import-wiki.mjs
        { label: 'Machines', translations: { fr: 'Machines' }, items: machines },
        { label: 'Reference', translations: { fr: 'Référence' }, items: ['crafting', 'in-game-texts', 'configuration', 'jei-jade-wthit'] },
        { label: 'Changelog', translations: { fr: 'Notes de version' }, collapsed: true, items: [{ autogenerate: { directory: 'changelog' } }] },
      ],
    }),
  ],
});
