import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TOPIC_SLUGS } from './data/topics';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // One sentence. Used in the archive, the RSS feed, and the meta description.
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // At least one topic, and only slugs from src/data/topics.ts.
    // A typo here fails the build rather than creating an orphan tag page.
    topics: z.array(z.enum(TOPIC_SLUGS)).min(1),

    // Product versions this post was written against. Business Central content
    // goes stale fast, so say so up front.
    // e.g. ["Business Central 26", "AL runtime 15"]
    appliesTo: z.array(z.string()).optional(),

    // When you last re-checked that the post is still correct. Shown separately
    // from pubDate so an old-but-verified post still reads as trustworthy.
    lastReviewed: z.coerce.date().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
