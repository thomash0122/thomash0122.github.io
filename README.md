# Personal site

Astro site built around a technical blog, with a curated topic taxonomy,
client-side search, a projects page that pulls live GitHub stats, and a
professional profile. Static output, no client-side framework, self-hosted fonts.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro build, then pagefind indexes dist/
npm run preview  # serve the built site — use this to test search
```

Requires Node 20 or newer.

**Search only works in the built site.** `npm run dev` doesn't run Pagefind, so
the box will say the index is missing. That's expected — use `npm run build &&
npm run preview` to test it.

## Structure

```
/                    headline, topic grid, six latest posts
/blog                full archive with search, grouped by year
/topics              the taxonomy with post counts
/topics/edi          every post on one topic
/topics/edi/rss.xml  a feed per topic
/projects            GitHub projects with live stats
/about               profile, certifications, experience
/rss.xml             everything
```

## Make it yours

| What | Where |
| --- | --- |
| Name, headline, email, social links | `src/data/site.ts` |
| Your domain | `site` in `astro.config.mjs`, and `public/robots.txt` |
| Certifications, experience, skills | `src/data/profile.ts` |
| Your GitHub repos | `src/data/projects.ts` |
| The topic list | `src/data/topics.ts` |
| Delete the five sample posts | `src/content/blog/` |
| Favicon (placeholder monogram) | `public/favicon.svg` |
| Colours and type scale | `:root` in `src/styles/global.css` |

## Topics

The taxonomy is a fixed list in `src/data/topics.ts`. Posts may only use slugs
from that list — a typo fails the build instead of quietly creating an orphan
tag page with one post on it.

Current set: `business-central`, `edi`, `power-automate`, `sharepoint`,
`al-development`, `dataverse`, `power-bi`, `azure`, `integration`.

To add one, add the slug to `TOPIC_SLUGS` and its label and blurb to the
`topics` record below it. That's all — the index, the topic page, the feed and
the counts all derive from it.

Keep the list between roughly eight and twelve. Below that, topics stop
discriminating; above it they fragment and each page gets too thin to rank.

## Writing a post

Drop a `.md` file in `src/content/blog/`. The filename becomes the URL, so
`inbound-850-business-central.md` publishes at
`/blog/inbound-850-business-central`.

```markdown
---
title: Handling inbound EDI 850 purchase orders in Business Central
description: One sentence. Shows in the archive, the feed, and the meta tag.
pubDate: 2026-06-18
topics: [edi, business-central, al-development]
appliesTo: ['Business Central 26', 'AL runtime 15']
lastReviewed: 2026-08-02
draft: false
---

Body goes here.
```

**Required:** `title`, `description`, `pubDate`, and at least one topic.

**`appliesTo`** renders as a badge under the title. Use it on anything
version-sensitive. Business Central content goes stale faster than almost
anything, and a post that states what it was written against is substantially
more trustworthy than one that doesn't.

**`lastReviewed`** shows separately from `pubDate`, so an older post you have
re-checked still reads as current. Worth updating when a new BC wave lands.

**`draft: true`** hides a post from the archive, feeds, sitemap and search in
production, but still shows it in `npm run dev`.

Reading time is computed from the body — you don't set it.

## Projects and GitHub stats

`src/data/projects.ts` holds the list: repo, display name, and your own blurb.
At build time the site fetches stars, primary language and last-push date from
the GitHub API and merges them in.

If the API is unreachable or rate limited, the build logs one warning and renders
the page without stats. It never fails the build over decoration.

Unauthenticated GitHub API calls are limited to 60/hour **per IP**, and CI
runners share IPs — so an unauthenticated build will start getting 403s at
random. The workflow passes `GITHUB_TOKEN`, raising this to 5000/hour. For stats
locally too:

```bash
GITHUB_TOKEN=ghp_yourtoken npm run build
```

## Search

Pagefind, run as a post-build step. It indexes only what sits inside
`data-pagefind-body` — the post article — so navigation and footer text never
appear in results. The UI is custom rather than Pagefind's default bundle, so it
matches the rest of the site. Press `/` on the blog page to focus it.

## The profile PDF

There's no separate PDF to keep in sync. Open `/about` and print it — the print
stylesheet drops the navigation, goes black-on-white, adds your contact line and
stops roles breaking across pages. Save as PDF from the print dialog.

## Deploying to GitHub Pages

1. Name the repo `<yourusername>.github.io` and push to `main`. (Any other name
   serves from a subpath and needs `base` set in `astro.config.mjs`.)
2. **Settings → Pages → Source → GitHub Actions.**
3. Done. `.github/workflows/deploy.yml` builds and publishes on every push.

The workflow file must be on your default branch or nothing happens.

### Custom domain

Add `public/CNAME` containing just your domain, then point DNS at GitHub: a
`CNAME` record for `www` → `<yourusername>.github.io`, or `A` records at
GitHub's Pages IPs for the apex. Tick **Enforce HTTPS** once the certificate
provisions. Pages needs a **public** repo unless you're on a paid plan.

## Design notes

The topic taxonomy is the primary navigation, because readers arrive from a
search for a specific problem rather than from the home page. The year rail on
the archive is deliberate: with Business Central content, publication year is
load-bearing information, not decoration.

Type is the IBM Plex superfamily — drawn for technical documentation, which is
what this is. Condensed for headings so long titles fit on fewer lines; Mono for
every date, tag, version and identifier, since this subject matter is full of
them.

No entrance animations. Link and card hovers only, gated behind
`@media (hover: hover)` so they don't misfire on touch. Dark mode follows the
system setting.
