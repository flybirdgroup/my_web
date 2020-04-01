const siteConfig  = {
  title: 'AI爱好者',
  tagline: '让更多人都玩人工智能',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'AI爱好者',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg'},
      links: [
        {to: 'docs/createlinux',activeBasePath: 'docs',label: '谷歌云',position: 'right'},
        { search: true },
        {to: 'docs/BIGQUERY',activeBasePath: 'docs',label: 'BIQ QUERY',position: 'right'},
        {to: 'blog', label: 'Blog',position: 'right'},
        { languages: true },
        {to: 'docs/projects',activeBasePath: 'docs',label: 'Fun Easy Projects',position: 'right'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
      translationRecruitingLink: 'https://crowdin.com/project/docusaurus',
      algolia: {
        apiKey: '0f9f28b9ab9efae89810921a351753b5',
        indexName: 'github',
      },
      gaTrackingId: 'UA-12345678-9',
      highlight: {
        theme: 'default',
  },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

module.exports = siteConfig;