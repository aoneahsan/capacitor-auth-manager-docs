import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ---------------------------------------------------------------------------
// Capacitor Auth Manager — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://www.npmjs.com/package/capacitor-auth-manager
// ---------------------------------------------------------------------------

const SITE_URL = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const NPM_URL = 'https://www.npmjs.com/package/capacitor-auth-manager';
const REPO_URL = 'https://github.com/aoneahsan/capacitor-auth-manager';
const DOCS_REPO_URL = 'https://github.com/aoneahsan/capacitor-auth-manager-docs';

const config: Config = {
  title: 'Capacitor Auth Manager Docs',
  tagline:
    'Firebase-agnostic Google sign-in for web and Capacitor — one API on web, iOS, and Android.',
  favicon: 'img/favicon.svg',

  // Production URL — served from Firebase Hosting / GitHub Pages at the custom domain.
  url: SITE_URL,
  baseUrl: '/',

  // GitHub metadata (drives OG tags + edit-this-page links)
  organizationName: 'aoneahsan',
  projectName: 'capacitor-auth-manager-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  // SEO + AI-citability head tags. JSON-LD payloads (WebSite, Organization,
  // SoftwareSourceCode) help Google Rich Results, Perplexity, ChatGPT, and
  // Claude extract structured entity data when citing this documentation.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'canonical', href: `${SITE_URL}/` },
    },
    {
      tagName: 'meta',
      attributes: { name: 'application-name', content: 'Capacitor Auth Manager Docs' },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-title',
        content: 'Capacitor Auth Manager Docs',
      },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#6366f1' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Capacitor Auth Manager Documentation',
        url: SITE_URL,
        description:
          'Documentation for capacitor-auth-manager, a Firebase-agnostic Google authentication library for Capacitor and the web — a drop-in alternative to @codetrix-studio/capacitor-google-auth. One auth.signIn(AuthProvider.GOOGLE) call returns a Google id token on web, iOS, and Android for React, Vue, Angular, and vanilla JS. Google is the enabled provider in 2.4.x; more providers are being added one at a time. Author: Ahsan Mahmood.',
        inLanguage: 'en',
        publisher: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
          email: 'aoneahsan@gmail.com',
          sameAs: [
            'https://linkedin.com/in/aoneahsan',
            'https://github.com/aoneahsan',
            'https://www.npmjs.com/~aoneahsan',
          ],
        },
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'capacitor-auth-manager',
        codeRepository: REPO_URL,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Web, Android, iOS',
        url: NPM_URL,
        sameAs: NPM_URL,
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Firebase-agnostic Google authentication for Capacitor and the web — a drop-in alternative to @codetrix-studio/capacitor-google-auth. One API across web, iOS, Android, React, Vue, Angular, and vanilla JS. Google is enabled in 2.4.x; more providers are added one at a time. MIT-licensed.',
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ahsan Mahmood',
        alternateName: 'aoneahsan',
        url: 'https://aoneahsan.com',
        email: 'aoneahsan@gmail.com',
        sameAs: [
          'https://linkedin.com/in/aoneahsan',
          'https://github.com/aoneahsan',
          'https://www.npmjs.com/~aoneahsan',
          'https://aoneahsan.com',
        ],
        founder: { '@type': 'Person', name: 'Ahsan Mahmood' },
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // `docs/` is BOTH the published content dir and the home of the
          // fixed-path internal file docs/MANUAL-TASKS.md. Keep the path (the
          // global rule fixes it) but never publish it — this repo is public.
          // NOTE: `exclude` REPLACES the plugin defaults, so they are restated.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
          ],
          routeBasePath: '/',
          editUrl: `${DOCS_REPO_URL}/edit/main/`,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: 'date',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for capacitor-auth-manager — Firebase-agnostic Google sign-in for the web and Capacitor (iOS/Android), a drop-in alternative to @codetrix-studio/capacitor-google-auth. Google is enabled in 2.4.x; more providers coming one at a time. Works with React, Vue, Angular, and vanilla JS. Maintained by Ahsan Mahmood.',
      },
      {
        name: 'keywords',
        content:
          'capacitor google auth, google sign in, capacitor-google-auth alternative, codetrix capacitor google auth, firebase-agnostic google auth, google identity services, credential manager, googlesignin ios, capacitor authentication plugin, signInWithCredential, react google auth, vue google auth, angular google auth, capacitor oauth',
      },
      { name: 'author', content: 'Ahsan Mahmood' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Capacitor Auth Manager Docs' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'Ahsan Mahmood' },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Capacitor Auth Manager',
      logo: {
        alt: 'Capacitor Auth Manager logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/getting-started/quick-start', label: 'Quick Start', position: 'left' },
        { to: '/api/auth-singleton', label: 'API', position: 'left' },
        { to: '/about-the-author', label: 'Author', position: 'right' },
        { href: NPM_URL, label: 'npm', position: 'right' },
        { href: DOCS_REPO_URL, label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'Installation', to: '/getting-started/installation' },
            { label: 'Quick Start', to: '/getting-started/quick-start' },
            { label: 'API Reference', to: '/api/auth-singleton' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'npm package', href: NPM_URL },
            { label: 'Source repository', href: REPO_URL },
            { label: 'Docs source', href: DOCS_REPO_URL },
          ],
        },
        {
          title: 'Built by Ahsan Mahmood',
          items: [
            { label: 'aoneahsan.com', href: 'https://aoneahsan.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan' },
            { label: 'GitHub', href: 'https://github.com/aoneahsan' },
            { label: 'npm packages', href: 'https://www.npmjs.com/~aoneahsan' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. capacitor-auth-manager is MIT-licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'jsx', 'tsx', 'java', 'swift', 'yaml', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
