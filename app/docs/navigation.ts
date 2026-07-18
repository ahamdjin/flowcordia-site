type NavigationItem = {
  name: string;
  href: string;
  isNew?: boolean;
  isUpdated?: boolean;
};

type NavigationGroup = {
  name: string;
  children: NavigationItem[];
};

export const NAVIGATION: NavigationGroup[] = [
  {
    name: 'Getting Started',
    children: [
      {
        name: 'Introduction',
        href: '/docs',
      },
      {
        name: 'Getting started',
        href: '/docs/getting-started',
      },
    ],
  },
  {
    name: 'Build',
    children: [
      {
        name: 'Studio',
        href: '/docs/studio',
      },
      {
        name: 'Workflow model',
        href: '/docs/workflow-model',
      },
      {
        name: 'Source',
        href: '/docs/source',
      },
      {
        name: 'Typed functions',
        href: '/docs/typed-functions',
      },
    ],
  },
  {
    name: 'Ship',
    children: [
      {
        name: 'Git proposals',
        href: '/docs/git-proposals',
      },
      {
        name: 'Preview deployments',
        href: '/docs/preview-deployments',
      },
    ],
  },
  {
    name: 'Operate',
    children: [
      {
        name: 'Runs',
        href: '/docs/runs',
      },
      {
        name: 'Security boundaries',
        href: '/docs/security',
      },
      {
        name: 'Self-hosting',
        href: '/docs/self-hosting',
      },
    ],
  },
  {
    name: 'Reference',
    children: [
      {
        name: 'Capability status',
        href: '/docs/capability-status',
      },
    ],
  },
];
