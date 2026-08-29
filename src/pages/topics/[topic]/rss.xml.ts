import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../../lib/posts';
import { TOPIC_SLUGS, topics, type TopicSlug } from '../../../data/topics';
import { site } from '../../../data/site';

// A feed per topic. Someone who only cares about EDI can subscribe to just EDI,
// which is rare enough in this niche to be worth the twenty lines.
export async function getStaticPaths() {
  return TOPIC_SLUGS.map((topic) => ({ params: { topic } }));
}

export async function GET(context: APIContext) {
  const topic = context.params.topic as TopicSlug;
  const meta = topics[topic];
  const posts = (await getPosts()).filter((post) =>
    post.data.topics.includes(topic)
  );

  return rss({
    title: `${site.name} — ${meta.label}`,
    description: meta.blurb,
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
