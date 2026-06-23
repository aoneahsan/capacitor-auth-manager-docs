import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebar layout for capacitor-auth-manager docs.
 * Every page below is source-accurate against the package's src/.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Framework Adapters',
      collapsed: false,
      items: [
        'frameworks/vanilla-js',
        'frameworks/react',
        'frameworks/vue',
        'frameworks/angular',
      ],
    },
    {
      type: 'category',
      label: 'Providers',
      collapsed: true,
      items: [
        'providers/overview',
        {
          type: 'category',
          label: 'OAuth / Social',
          collapsed: true,
          items: [
            'providers/google',
            'providers/apple',
            'providers/microsoft',
            'providers/facebook',
            'providers/github',
            'providers/slack',
            'providers/linkedin',
            'providers/firebase',
          ],
        },
        {
          type: 'category',
          label: 'Password',
          collapsed: true,
          items: [
            'providers/email-password',
            'providers/username-password',
            'providers/phone-password',
          ],
        },
        {
          type: 'category',
          label: 'Passwordless',
          collapsed: true,
          items: [
            'providers/email-code',
            'providers/sms',
            'providers/magic-link',
          ],
        },
        'providers/biometric',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api/auth-singleton',
        'api/types',
        'api/errors',
        'api/storage',
      ],
    },
    {
      type: 'category',
      label: 'Platforms',
      collapsed: true,
      items: [
        'platforms/web',
        'platforms/android',
        'platforms/ios',
      ],
    },
    'faq',
    'changelog',
    {
      type: 'category',
      label: 'About',
      collapsed: true,
      items: ['about-the-author'],
    },
  ],
};

export default sidebars;
