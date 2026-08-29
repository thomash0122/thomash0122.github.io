import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';
import { topics } from '../data/topics';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.topics.map((slug) => topics[slug].label),
    })),
    customData: '<language>en-us</language>',
  });
}
