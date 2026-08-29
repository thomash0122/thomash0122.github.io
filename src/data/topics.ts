// The curated taxonomy. This is the single source of truth: posts may only use
// slugs from this list, so a typo fails the build instead of silently creating
// an orphan tag page with one post on it.
//
// Adding a topic: add the slug here, then add its entry to `topics` below.
// Keep the list between roughly 8 and 12. Fewer and tags stop discriminating;
// more and they fragment.

export const TOPIC_SLUGS = [
  'business-central',
  'edi',
  'power-automate',
  'sharepoint',
  'al-development',
  'dataverse',
  'power-bi',
  'azure',
  'integration',
  'ai-agents',
] as const;

export type TopicSlug = (typeof TOPIC_SLUGS)[number];

export interface Topic {
  label: string;
  /** Shown on the topic index and at the top of the topic page. One sentence. */
  blurb: string;
}

export const topics: Record<TopicSlug, Topic> = {
  'business-central': {
    label: 'Business Central',
    blurb: 'Configuration, extensions, and the parts of BC that the docs skip.',
  },
  edi: {
    label: 'EDI',
    blurb: 'X12 and EDIFACT document flows, trading partner setup, and acknowledgements.',
  },
  'power-automate': {
    label: 'Power Automate',
    blurb: 'Flow patterns, error handling, and connecting Power Automate to business systems.',
  },
  sharepoint: {
    label: 'SharePoint',
    blurb: 'Document libraries, metadata, and using SharePoint as real infrastructure.',
  },
  'al-development': {
    label: 'AL Development',
    blurb: 'Writing AL extensions that survive the next upgrade.',
  },
  dataverse: {
    label: 'Dataverse',
    blurb: 'Tables, relationships, and moving data between Dataverse and everything else.',
  },
  'power-bi': {
    label: 'Power BI',
    blurb: 'Reporting on operational data without melting the source system.',
  },
  azure: {
    label: 'Azure',
    blurb: 'Functions, storage, and the glue services that hold integrations together.',
  },
  integration: {
    label: 'Integration & APIs',
    blurb: 'The general problem: getting two systems to agree, reliably, forever.',
  },
  'ai-agents': {
    label: 'AI Agents',
    blurb: 'Copilot, agent frameworks, and putting LLMs to work against business data without letting them near the ledger.',
  },
};

export function topicLabel(slug: TopicSlug): string {
  return topics[slug].label;
}

export const allTopics = TOPIC_SLUGS.map((slug) => ({ slug, ...topics[slug] }));
