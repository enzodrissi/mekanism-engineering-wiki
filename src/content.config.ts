import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // set by scripts/import-wiki.mjs on the pages of a block or an item
        machine: z.object({
          id: z.string(),
          quantum: z.boolean(),
          structure: z.boolean(),
          model: z.string().optional(),
          isNew: z.boolean().optional(),
        }).optional(),
      }),
    }),
  }),
};
