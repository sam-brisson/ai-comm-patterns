import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AI Communication Patterns',
  tagline: 'Ideas and Exploration on the Topic of Human / AI Collaboration',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://sam-brisson.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/ai-comm-patterns/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sam-brisson', // Usually your GitHub org/user name.
  projectName: 'ai-comm-patterns', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',         
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sam-brisson/ai-comm-patterns/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sam-brisson/ai-comm-patterns/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'AI Communication Patterns',
      logo: {
        alt: 'AI Communication Patterns Logo',
        src: 'img/ai-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'CollabSidebar',
          position: 'left',
          label: 'Collaboration',
        },
        {
          type: 'docSidebar',
          sidebarId: 'TrustSidebar',
          position: 'left',
          label: 'Trust',
        },
        {
          type: 'docSidebar',
          sidebarId: 'ExperimenationSidebar',
          position: 'left',
          label: 'Experimentation',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start Here',
          items: [
            {
              label: 'What is this about?',
              to: '/docs/experimentation/start',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/sbrisson/',
            },            
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Communication Patterns. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;