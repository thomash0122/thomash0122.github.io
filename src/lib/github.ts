// Build-time enrichment of the curated project list with live GitHub stats.
//
// Two rules here, both learned the hard way:
//   1. This must never fail the build. Stars are decoration; a broken deploy
//      is not. Every failure path returns null and logs a warning.
//   2. Unauthenticated GitHub API calls are limited to 60/hour *per IP*, and
//      CI runners share IPs, so an unauthenticated build will eventually start
//      getting 403s at random. The workflow passes GITHUB_TOKEN, which raises
//      the limit to 5000/hour. See .github/workflows/deploy.yml.

export interface RepoStats {
  stars: number;
  language: string | null;
  pushedAt: string;
  /** The repo's own description, if you'd rather not duplicate it. */
  description: string | null;
  homepage: string | null;
  archived: boolean;
}

const cache = new Map<string, RepoStats | null>();
let warned = false;

function warnOnce(message: string) {
  if (warned) return;
  warned = true;
  console.warn(
    `[projects] ${message} — building without live GitHub stats. ` +
      'The projects page will still render from src/data/projects.ts.'
  );
}

export async function fetchRepoStats(repo: string): Promise<RepoStats | null> {
  if (cache.has(repo)) return cache.get(repo)!;

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'personal-site-build',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let stats: RepoStats | null = null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 404) {
      warnOnce(`${repo} not found`);
    } else if (res.status === 403 || res.status === 429) {
      warnOnce('GitHub API rate limit reached');
    } else if (!res.ok) {
      warnOnce(`GitHub API returned ${res.status}`);
    } else {
      const data: any = await res.json();
      stats = {
        stars: data.stargazers_count ?? 0,
        language: data.language ?? null,
        pushedAt: data.pushed_at ?? '',
        description: data.description ?? null,
        homepage: data.homepage || null,
        archived: Boolean(data.archived),
      };
    }
  } catch {
    warnOnce('GitHub API unreachable');
  }

  cache.set(repo, stats);
  return stats;
}

/** Fetches stats for every repo in parallel. Never throws. */
export async function fetchAllStats(
  repos: string[]
): Promise<Map<string, RepoStats | null>> {
  const entries = await Promise.all(
    repos.map(async (repo) => [repo, await fetchRepoStats(repo)] as const)
  );
  return new Map(entries);
}

/** "3 days ago" / "5 months ago". Empty string if we have no date. */
export function relativeDate(iso: string): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}
