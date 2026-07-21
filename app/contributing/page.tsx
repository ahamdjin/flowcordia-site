import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Contributing - Flowcordia',
  description:
    'Learn Flowcordia’s local setup, pull-request discipline, testing expectations, documentation ownership, and merge rules.',
};

export default function ContributingPage() {
  return (
    <ResourcePage
      eyebrow='Contributing'
      title='Contribute one complete boundary at a time.'
      description='Flowcordia accepts changes because they preserve one connected product—not because they add visible surface area quickly. Every contribution must keep browser, server, GitHub, database, deployment, runtime, failure, and rollback ownership explicit.'
      actions={[
        {
          label: 'Contribution guide',
          href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/CONTRIBUTING.md',
          external: true,
          primary: true,
        },
        {
          label: 'Browse open issues',
          href: 'https://github.com/ahamdjin/Flowcordia/issues',
          external: true,
        },
      ]}
      sections={[
        {
          id: 'local-setup',
          title: 'Local setup',
          paragraphs: [
            'Flowcordia currently develops inside the inherited Trigger.dev monorepo. Use the repository-pinned toolchain and start from the current verified main head.',
          ],
          bullets: [
            'Node.js 20.20.2.',
            'pnpm 10.33.2.',
            'Docker for database-backed and end-to-end suites.',
          ],
          code:
            'git clone https://github.com/ahamdjin/Flowcordia.git\ncd Flowcordia\npnpm install --frozen-lockfile\npnpm run typecheck\npnpm run test:packages\npnpm run test:webapp\npnpm run build --filter webapp',
        },
        {
          id: 'required-sequence',
          title: 'Required contribution sequence',
          bullets: [
            'Start from the current verified main head.',
            'Define one product or infrastructure boundary and list explicit exclusions.',
            'Map every changed upstream and downstream connection before implementation.',
            'Keep browser, server, GitHub, database, deployment, and runtime ownership explicit.',
            'Update validation, failure, security, rollout, rollback, and documentation with the code.',
            'Run focused tests while developing and the complete required matrix on the exact final head.',
            'Keep the pull request in draft while a required check is red, missing, stale, or unreadable.',
            'Merge only the reviewed exact head and verify main after merge.',
          ],
        },
        {
          id: 'pr-contract',
          title: 'Every pull request must explain',
          bullets: [
            'The user or operator outcome.',
            'The exact trust boundary and owning subsystem.',
            'Which existing platform service is reused.',
            'What is deliberately excluded.',
            'Schema, identity, authorization, idempotency, retry, timeout, and failure behavior.',
            'Browser-visible and browser-hidden data.',
            'Tests executed and their exact result.',
            'Connected-environment validation completed and not completed.',
            'Rollout and rollback.',
          ],
          note:
            'Repository-only tests must never be described as live deployment proof.',
        },
        {
          id: 'architectural-rules',
          title: 'Architectural rules contributors preserve',
          bullets: [
            'Git remains the governed history for workflows, generated artifacts, reviews, releases, and rollbacks.',
            'Trigger.dev remains the execution foundation unless an accepted decision record replaces a subsystem.',
            'The browser never supplies trusted tenant, repository, actor, credential, worker, or policy identity.',
            'Unreviewed repository code never executes inside the web application process.',
            'Secrets are referenced and never embedded in workflow JSON, source, audit events, or browser projections.',
            'Unknown remote write outcomes are reconciled rather than retried blindly.',
            'Unsupported runtime intent blocks publication instead of disappearing silently.',
          ],
        },
        {
          id: 'testing',
          title: 'Minimum testing expectations',
          cards: [
            {
              title: 'Contracts and validation',
              description:
                'Valid, malformed, oversized, duplicate, unknown-property, migration, and round-trip behavior where applicable.',
            },
            {
              title: 'Identity and authorization',
              description:
                'Tenant scope, browser redaction, stale identity, optimistic concurrency, and unauthorized access.',
            },
            {
              title: 'Failure behavior',
              description:
                'Provider outage, rate limit, timeout, ambiguous write, retry, reconciliation, and rollback paths.',
            },
            {
              title: 'Deterministic output',
              description:
                'Serialization, compilation, generated artifacts, type checking, builds, and relevant end-to-end coverage.',
            },
          ],
        },
        {
          id: 'documentation',
          title: 'Documentation belongs to the change',
          bullets: [
            'Architecture and ownership under flowcordia/architecture/.',
            'Live component connections in flowcordia/connections/README.md.',
            'Trust and data boundaries under flowcordia/security/.',
            'Contract, failure, integration, and acceptance matrices under flowcordia/testing/.',
            'Rollout, recovery, and rollback procedures under flowcordia/runbooks/.',
            'Delivered, partial, inherited, and planned behavior under flowcordia/product/.',
          ],
        },
        {
          id: 'merge-rules',
          title: 'Do not merge when',
          bullets: [
            'A required job failed, was cancelled, or did not run on the final head.',
            'The branch diverged from the reviewed parent unexpectedly.',
            'Temporary diagnostics, generated logs, or formatter artifacts remain.',
            'A migration is not reproducible.',
            'A connected acceptance claim lacks evidence.',
            'The pull request mixes unrelated product boundaries.',
            'The rollback path is unknown.',
          ],
        },
      ]}
      closing={{
        title: 'Begin with context, not code.',
        description:
          'Read the engineering index and contribution discipline, then use Discussions for broad direction or Issues for a scoped, reproducible boundary.',
        actions: [
          {
            label: 'Engineering index',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/README.md',
            external: true,
            primary: true,
          },
          {
            label: 'Contribution discipline',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/CONTRIBUTING.md',
            external: true,
          },
          {
            label: 'Start a discussion',
            href: 'https://github.com/ahamdjin/Flowcordia/discussions',
            external: true,
          },
        ],
      }}
    />
  );
}
