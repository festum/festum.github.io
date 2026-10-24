import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    order: z.number(),
    status: z.enum(['live', 'in-progress']),
    externalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products };
