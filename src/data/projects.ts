// Your GitHub projects. Write the name and blurb yourself — the build pulls
// live stars, language, and last-push date from the GitHub API and merges them
// in. If the API is unavailable or rate-limited, the build still succeeds and
// simply omits the stats.

import type { TopicSlug } from './topics';

export interface Project {
  /** owner/repo — used for both the link and the stats lookup. */
  repo: string;
  /** Display name. Repo names are rarely readable enough on their own. */
  name: string;
  /** Why someone should care. One or two sentences, in your words. */
  blurb: string;
  topics: TopicSlug[];
  /** Optional: pin a project to the top of the list. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    repo: 'thomash0122/bc-edi-toolkit',
    name: 'BC EDI Toolkit',
    blurb:
      'AL extension that handles inbound 850 and outbound 855/856/810 documents in Business Central, with a partner-agnostic mapping layer so you are not rewriting codeunits for every new trading partner.',
    topics: ['edi', 'business-central', 'al-development'],
    featured: true,
  },
  {
    repo: 'thomash0122/power-automate-bc-patterns',
    name: 'Power Automate BC Patterns',
    blurb:
      'A set of importable flow templates for the things every Business Central integration needs: authenticated API calls, exponential backoff, and failure alerting that does not spam the channel.',
    topics: ['power-automate', 'business-central', 'integration'],
  },
  {
    repo: 'thomash0122/x12-inspector',
    name: 'X12 Inspector',
    blurb:
      'Command-line tool that parses an X12 interchange and prints it as readable, indented segments. Written because reading a raw 856 in a text editor at midnight is not a reasonable thing to ask of anyone.',
    topics: ['edi'],
  },
];
