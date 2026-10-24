// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Visitor counter: GoatCounter (no cookies, no consent banner). Empty = no counter.
export const GOATCOUNTER = 'mekanism-engineering-wiki';

export default defineConfig({
  site: 'https://enzodrissi.github.io',
  base: '/mekanism-engineering-wiki',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Mekanism: Engineering',
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
      pagination: true,
      sidebar: [
        {
          label: 'Start here',
          items: [
            'start/overview',
            'start/basics',
            { label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
            'start/faq',
          ],
        },
        {
          label: 'Machines',
          items: [
            { label: 'Ore refining', items: [{ autogenerate: { directory: 'machines/ore-refining' } }] },
            { label: 'Mining', items: [{ autogenerate: { directory: 'machines/mining' } }] },
            { label: 'Quantum network', items: [{ autogenerate: { directory: 'machines/quantum-network' } }] },
            { label: 'Teleportation', items: [{ autogenerate: { directory: 'machines/teleportation' } }] },
            { label: 'Charging', items: [{ autogenerate: { directory: 'machines/charging' } }] },
            { label: 'Fluids and rocks', items: [{ autogenerate: { directory: 'machines/fluids-and-rocks' } }] },
            { label: 'Logistics', items: [{ autogenerate: { directory: 'machines/logistics' } }] },
          ],
        },
        { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
        { label: 'Changelog', collapsed: true, items: [{ autogenerate: { directory: 'changelog' } }] },
      ],
    }),
  ],
});
