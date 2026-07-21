import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Changelog - Flowcordia',
  description:
    'Follow Flowcordia’s open-source development history, current foundation, and future tagged releases.',
};

export default function ChangelogPage() {
  return (
    <ResourcePage
      eyebrow='Changelog'
      title='The development history is public.'
      description='Flowcordia has not published a production release yet. Until versioned releases begin, the repository, pull requests, capability matrix, and release-readiness evidence are the authoritative development record.'
      actions={[
        {
          label: 'Browse pull requests',
          href: 'https://github.com/ahamdjin/Flowcordia/pulls?q=is%3Apr+is%3Aclosed',
          external: true,
          primary: true,
        },
        {
          label: 'View commits',
          href: 'https://github.com/ahamdjin/Flowcordia/commits/main',
          external: true,
        },
      ]}
      sections={[
        {
          id: 'release-status',
          title: 'Release status',
          paragraphs: [
            'Current maturity is internal alpha. No tagged build should be interpreted as production-ready until the connected acceptance, installation, recovery, and operational gates are satisfied.',
          ],
          cards: [
            {
              title: 'Tagged releases',
              description:
                'Not published yet. Versioned release notes will appear here once a supported release process exists.',
            },
            {
              title: 'Authoritative history',
              description:
                'Exact commits, reviewable pull requests, capability coverage, test evidence, and release-readiness documents.',
            },
          ],
        },
        {
          id: 'current-foundation',
          title: 'Current foundation',
          bullets: [
            'Portable workflow and typed-function contracts.',
            'Repository discovery and exact-commit reads.',
            'Durable Studio drafts and visual graph editing.',
            'Deterministic Trigger.dev source generation.',
            'Governed GitHub proposals and exact-head review evidence.',
            'Preview deployment correlation and version-locked runs.',
            'Policy evaluation, audit, outbox processing, and reconciliation.',
            'Installation and live-dependency preflight tooling.',
          ],
        },
        {
          id: 'how-updates-are-recorded',
          title: 'How changes are recorded',
          bullets: [
            'One reviewable product or infrastructure boundary per pull request.',
            'Required checks run against the exact final head.',
            'Delivered behavior updates architecture, security, testing, runbooks, and capability coverage together.',
            'Connected-environment validation is identified separately from repository-only evidence.',
            'After merge, main is verified before the next dependent change begins.',
          ],
        },
        {
          id: 'future-format',
          title: 'What versioned changelog entries will include',
          cards: [
            {
              title: 'Added and changed',
              description:
                'User-visible capabilities, operator behavior, contracts, migrations, and supported deployment modes.',
            },
            {
              title: 'Known limitations',
              description:
                'Incomplete provider paths, unsupported workflow intent, operational constraints, and compatibility boundaries.',
            },
            {
              title: 'Upgrade and rollback',
              description:
                'Exact version transitions, migration ownership, backup requirements, rollback compatibility, and evidence.',
            },
            {
              title: 'Security impact',
              description:
                'Trust-boundary changes, browser-visible data, secret handling, authorization, and remediation guidance.',
            },
          ],
        },
      ]}
      closing={{
        title: 'Follow development at the source.',
        description:
          'The repository is the complete record today. Tagged releases and curated release notes will be added when Flowcordia reaches a supported distribution stage.',
        actions={[
          {
            label: 'Application repository',
            href: 'https://github.com/ahamdjin/Flowcordia',
            external: true,
            primary: true,
          },
          {
            label: 'Capability matrix',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/capability-matrix.md',
            external: true,
          },
        ]}
      />
  );
}
