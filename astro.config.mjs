// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// CHANGE THIS to your real domain before you deploy.
// RSS, sitemap and social tags all build absolute URLs from it.
const SITE = 'https://example.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: {
    // Small site: inlining beats a second request.
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans Condensed',
      cssVariable: '--font-display',
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
