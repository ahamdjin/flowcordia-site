import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Architecture - Flowcordia',
  description:
    'Understand Flowcordia’s Studio, portable workflow model, GitHub control plane, Trigger.dev execution foundation, and trust boundaries.',
};

export default function ArchitecturePage() {
  return (
    <ResourcePage
      eyebrow='Architecture'
      title='One governed workflow across canvas, code, Git, and runtime.'
      description='Flowcordia adds a visual Studio, portable typed workflow contracts, governed GitHub collaboration, and exact-head runtime evidence without duplicating the durable execution engine already owned by Trigger.dev.'
      actions={[
        {
          label: 'Open engineering index',
          href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/README.md',
          external: true,
          primary: true,
        },
        {
          label: 'Read the workflow model',
          href: '/docs/workflow-model',
        },
      ]}
      sections={[
        {
          id: 'system-shape',
          title: 'System shape',
          description:
            'Each layer owns a distinct responsibility. Flowcordia connects them through explicit contracts instead of rebuilding them inside one process.',
          code:
            'Studio and business UI\n        │\n        ▼\nPortable workflow model + deterministic compiler\n        │\n        ├──────────────► governed GitHub branch and pull request\n        │                         │\n        │                         ▼\n        │                 exact-head review and policy\n        │                         │\n        ▼                         ▼\nTrigger.dev execution plane ◄── deployment and promotion\n        │\n        ▼\nRuns, traces, logs, and bounded canvas evidence',
        },
        {
          id: 'planes',
          title: 'Four connected planes',
          cards: [
            {
              title: 'Authoring plane',
              description:
                'Studio edits one portable workflow model. Repository-owned typed functions stay explicit code and are referenced by contract.',
            },
            {
              title: 'Control plane',
              description:
                'Durable drafts, proposal state, optimistic concurrency, policy evidence, audit, outbox processing, and reconciliation.',
            },
            {
              title: 'Git collaboration plane',
              description:
                'Exact reads, proposal branches, generated source, pull requests, checks, review evidence, promotion, and rollback history.',
            },
            {
              title: 'Execution plane',
              description:
                'Trigger.dev remains responsible for deployments, workers, queues, durable waits, retries, runs, traces, and logs.',
            },
          ],
        },
        {
          id: 'source-of-truth',
          title: 'Source-of-truth rules',
          bullets: [
            'Git is the durable history for workflow definitions, generated artifacts, reviews, releases, and rollbacks.',
            'The portable workflow model is the contract shared by Studio, code tooling, GitHub adapters, and runtime generation.',
            'Trigger.dev remains the execution foundation unless an explicit architecture decision replaces a subsystem.',
            'Canonical workflow JSON and generated task source are committed together on the proposal branch.',
            'Repository-owned functions remain outside generated directories and are imported statically from reviewed paths.',
          ],
        },
        {
          id: 'trust-boundaries',
          title: 'Trust boundaries',
          bullets: [
            'The browser never chooses tenant, installation, repository, branch, database identity, actor, credentials, worker, or policy identity.',
            'Secrets are referenced by name and never embedded in workflow JSON, generated source, audit payloads, or browser projections.',
            'Unreviewed repository code does not execute inside the web application process.',
            'Unsupported runtime intent fails publication instead of being silently ignored.',
            'Ambiguous remote writes are reconciled instead of retried blindly.',
            'Repository CI and connected acceptance are separate required evidence.',
          ],
        },
        {
          id: 'repository-layout',
          title: 'Repository ownership',
          cards: [
            {
              title: 'packages/flowcordia-workflow',
              description:
                'Portable workflow and typed-function contracts, validation, migrations, and editor commands.',
            },
            {
              title: 'packages/flowcordia-github-*',
              description:
                'Installation-scoped storage, exact-commit reads, proposal branches, pull requests, evidence, and promotion.',
            },
            {
              title: 'packages/flowcordia-control-plane',
              description:
                'Durable proposal state, audit, outbox, reconciliation, and policy selection.',
            },
            {
              title: 'packages/flowcordia-runtime',
              description:
                'Deterministic compiler, structural preview, live adapters, and generated Trigger.dev source.',
            },
            {
              title: 'apps/webapp/app/features/flowcordia',
              description:
                'Authenticated Studio, source, proposal, validation, and operator adapters.',
            },
            {
              title: 'flowcordia/',
              description:
                'Product contracts, architecture, security boundaries, connection registry, tests, decisions, and runbooks.',
            },
          ],
        },
        {
          id: 'completion-rule',
          title: 'A connection is not complete until it agrees end to end',
          paragraphs: [
            'Configuration, validation, serialization, compilation, execution, observability, failure behavior, rollback, documentation, and round-trip tests must describe the same behavior. A visible UI surface alone is not treated as a completed capability.',
          ],
          note:
            'Flowcordia is internal alpha. The architecture contracts are strong, but a preserved connected reference deployment remains a release gate.',
        },
      ]}
      closing={{
        title: 'Inspect the actual contracts.',
        description:
          'The public engineering index links the architecture map, connection registry, decision records, security boundaries, testing matrices, and release runbooks used to keep the product connected.',
        actions={[
          {
            label: 'Engineering index',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/README.md',
            external: true,
            primary: true,
          },
          {
            label: 'Architecture documentation',
            href: 'https://github.com/ahamdjin/Flowcordia/tree/main/flowcordia/architecture',
            external: true,
          },
          {
            label: 'Connection registry',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/connections/README.md',
            external: true,
          },
        ]}
      />
  );
}
