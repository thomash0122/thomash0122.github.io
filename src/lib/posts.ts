import { getCollection, type CollectionEntry } from 'astro:content';
import { readingTime } from './format';
import { TOPIC_SLUGS, type TopicSlug } from '../data/topics';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are excluded from production builds. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPostsByTopic(topic: TopicSlug): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.data.topics.includes(topic));
}

/** Post count per topic, including zeros so the index stays complete. */
export async function getTopicCounts(): Promise<Record<TopicSlug, number>> {
  const posts = await getPosts();
  const counts = Object.fromEntries(
    TOPIC_SLUGS.map((slug) => [slug, 0])
  ) as Record<TopicSlug, number>;
  for (const post of posts) {
    for (const topic of post.data.topics) counts[topic]++;
  }
  return counts;
}

/** Groups posts into [year, posts] pairs, newest year first. */
export function groupByYear(posts: Post[]): Array<[number, Post[]]> {
  const map = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    const bucket = map.get(year);
    if (bucket) bucket.push(post);
    else map.set(year, [post]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function minutesFor(post: Post): number {
  return readingTime(post.body);
}

/**
 * Posts sharing the most topics with the given one, newest first.
 * Used for "related reading" at the foot of a post.
 */
export async function getRelated(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts();
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      shared: p.data.topics.filter((t) => post.data.topics.includes(t)).length,
    }))
    .filter((x) => x.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf()
    )
    .slice(0, limit)
    .map((x) => x.post);
}
