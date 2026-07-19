import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import GitHubIcon from './icons/github';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Studio', href: '/docs/studio' },
      { label: 'Workflow model', href: '/docs/workflow-model' },
      { label: 'Source', href: '/docs/source' },
      { label: 'Typed functions', href: '/docs/typed-functions' },
      { label: 'Git proposals', href: '/docs/git-proposals' },
      { label: 'Runs', href: '/docs/runs' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Getting started', href: '/docs/getting-started' },
      { label: 'Preview deployments', href: '/docs/preview-deployments' },
      { label: 'Security', href: '/docs/security' },
      { label: 'Self-hosting', href: '/docs/self-hosting' },
      { label: 'Capability status', href: '/docs/capability-status' },
    ],
  },
  {
    title: 'Open source',
    links: [
      {
        label: 'Application source',
        href: 'https://github.com/ahamdjin/Flowcordia',
        external: true,
      },
      {
        label: 'Website source',
        href: 'https://github.com/ahamdjin/flowcordia-site',
        external: true,
      },
      {
        label: 'Application licence',
        href: 'https://github.com/ahamdjin/Flowcordia/blob/main/LICENSE',
        external: true,
      },
      {
        label: 'Website licence',
        href: 'https://github.com/ahamdjin/flowcordia-site/blob/main/LICENCE.md',
        external: true,
      },
    ],
  },
  {
    title: 'Community',
    links: [
      {
        label: 'Discussions',
        href: 'https://github.com/ahamdjin/Flowcordia/discussions',
        external: true,
      },
      {
        label: 'Roadmap',
        href: 'https://github.com/ahamdjin/Flowcordia/issues',
        external: true,
      },
      {
        label: 'Report an issue',
        href: 'https://github.com/ahamdjin/Flowcordia/issues/new',
        external: true,
      },
      { label: 'Current status', href: '/docs/capability-status' },
    ],
  },
  {
    title: 'Social',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/ahamdjin/Flowcordia',
        external: true,
      },
      {
        label: 'Community',
        href: 'https://github.com/ahamdjin/Flowcordia/discussions',
        external: true,
      },
    ],
  },
];

function FooterNavigationLink({ link }: { link: FooterLink }) {
  const className =
    'text-sm text-zinc-400 transition-colors hover:text-zinc-50 focus-visible:text-zinc-50 focus-visible:outline-none';

  if (link.external) {
    return (
      <a
        href={link.href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-32 bg-zinc-950 text-zinc-50'>
      <div className='mx-auto w-full max-w-7xl px-6 pt-16 pb-8 lg:px-8'>
        <div className='grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5'>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className='text-sm font-medium text-zinc-50'>{group.title}</h2>
              <ul className='mt-6 space-y-4'>
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <FooterNavigationLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-14 border-t border-zinc-800 pt-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-3'>
              <Link href='/' className='inline-flex items-center gap-3'>
                <img
                  src='/flowcordia-logo-white.svg'
                  alt=''
                  className='h-6 w-auto'
                />
                <span className='text-base font-medium text-zinc-50'>
                  Flowcordia
                </span>
              </Link>
              <span className='text-sm text-zinc-500'>
                © {year} Flowcordia. Open source and built in public.
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <a
                href='https://github.com/ahamdjin/Flowcordia/discussions'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Flowcordia community discussions'
                className='inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600'
              >
                <MessagesSquare className='h-4 w-4' />
              </a>
              <a
                href='https://github.com/ahamdjin/Flowcordia'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Flowcordia on GitHub'
                className='inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600'
              >
                <GitHubIcon className='h-4 w-4 fill-current' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
