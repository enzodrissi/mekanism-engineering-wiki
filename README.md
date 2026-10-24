# Mekanism: Engineering wiki

The website of the wiki of [Mekanism: Engineering](https://gitlab.com/enzodr/mekanism-engineering), an addon for
Mekanism, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) and published on
GitHub Pages.

**The text is not written here.** It lives in the mod's repository (`docs/wiki/`) and is imported at every build,
together with the pictures, the mod's block models and textures, its recipes and its language file. To change a page,
change the mod's wiki; to change how pages look, change this repository.

## What is where

| Path | What it is |
|---|---|
| `scripts/import-wiki.mjs` | Downloads the mod's repository from GitLab and writes the pages, images, models, recipes and data the site uses. |
| `scripts/render-icons.mjs` | Draws every item's inventory icon from its real model, in a headless browser. |
| `scripts/check-links.mjs` | Fails if a page links to a file that does not exist. |
| `src/lib/` | The 3D engine: a Minecraft model reader for Three.js, the refinery structure, the viewers. |
| `src/content/docs/guides/` | The step-by-step guides (written here, from the wiki's facts). |
| `src/components/`, `src/styles/` | The look: home page, machine page headers, theme. |
| `public/mc/mekanism`, `public/mc/minecraft`, `public/icons/mekanism`, `public/icons/minecraft` | The few Mekanism (MIT) and vanilla files the mod's models borrow, and the icons of the recipe ingredients. |

Everything else under `src/content/docs/`, `public/` and `src/data/` is made by the import and is not committed.

## Building

Node 22.23.4 or newer (24 recommended).

```sh
npm ci
npx playwright install chromium   # once, for the icons
npm run import                    # WIKI_REF=<branch or tag> to choose the mod version; WIKI_ARCHIVE=<file> to use a local archive
npm run icons
npm run dev                       # or: npm run build && npm run preview
```

The ingredient icons and borrowed files are refreshed by hand when Mekanism changes:
`node scripts/render-icons.mjs --assets <unzipped jars>/assets --vendor`.

## Publishing

`.github/workflows/deploy.yml` builds the site on every push, pull request, every night and on demand. It deploys to
GitHub Pages only from `main` and only when the repository variable `DEPLOY` is `on`. The repository variable
`WIKI_REF` chooses which branch or tag of the mod is published.

Visits are counted by [GoatCounter](https://www.goatcounter.com) (no cookies): `GOATCOUNTER` in `astro.config.mjs`.

Block and item pictures come from the game's models and textures; Mekanism's assets are under the MIT licence. Not an
official Minecraft product, not approved by or associated with Mojang or Microsoft.
