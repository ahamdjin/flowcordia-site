import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Self-hosting - Flowcordia',
  description:
    'Understand Flowcordia’s self-hosted architecture, installation sequence, operational boundaries, and current internal-alpha limitations.',
};

export default function SelfHostingPage() {
  return (
    <ResourcePage
      eyebrow='Self-hosting'
      title='Run Flowcordia inside infrastructure you control.'
      description='Flowcordia is open source and designed for operator-controlled deployment. Git remains the durable workflow history, while the web application, database, GitHub integration, workers, runtime, secrets, backups, and observability remain under your control.'
      actions={[
        {
          label: 'Read the operator guide',
          href: '/docs/self-hosting',
          primary: true,
        },
        {
          label: 'View the repository',
          href: 'https://github.com/ahamdjin/Flowcordia',
          external: true,
        },
      ]}
      sections={[
        {
          id: 'deployment-model',
          title: 'Deployment model',
          description:
            'A complete Flowcordia installation is a connected system, not one container pretending to own every responsibility.',
          cards: [
            {
              title: 'Web and control plane',
              description:
                'The authenticated application, Studio, proposal state, policy evidence, audit history, and operator interfaces.',
            },
            {
              title: 'PostgreSQL',
              description:
                'Durable product state, optimistic versioning, proposal operations, outbox records, reconciliation, and audit data.',
            },
            {
              title: 'GitHub App',
              description:
                'Repository discovery, exact-commit reads, proposal branches, pull requests, checks, review evidence, and promotion.',
            },
            {
              title: 'Trigger.dev execution plane',
              description:
                'Deployments, queues, durable waits, retries, workers, execution traces, and run observability.',
            },
            {
              title: 'Dedicated proposal worker',
              description:
                'Processes durable proposal operations separately from request-serving web replicas.',
            },
            {
              title: 'Operator-owned secrets and storage',
              description:
                'Workflow secret values, object storage, TLS, backups, retention, telemetry, and infrastructure credentials.',
            },
          ],
        },
        {
          id: 'requirements',
          title: 'Current requirements',
          paragraphs: [
            'Flowcordia currently develops inside the inherited Trigger.dev monorepo. The toolchain is pinned so local validation and release builds use the same runtime assumptions.',
          ],
          bullets: [
            'Node.js 20.20.2.',
            'pnpm 10.33.2.',
            'Docker for database-backed and end-to-end suites.',
            'PostgreSQL for durable application and control-plane state.',
            'A GitHub App configured for repository collaboration.',
            'A connected Trigger.dev runtime and worker environment.',
          ],
          code:
            'pnpm install --frozen-lockfile\npnpm run typecheck\npnpm run test:packages\npnpm run test:webapp\npnpm run build --filter webapp',
        },
        {
          id: 'installation-sequence',
          title: 'Safe installation sequence',
          description:
            'The repository includes a deterministic, secret-safe preflight. A passing configuration check is required, but it does not replace live dependency checks or connected acceptance.',
          bullets: [
            'Select one exact Flowcordia commit and build every web and worker image from that revision.',
            'Configure separate web and proposal-worker deployments; do not run the proposal loop on every web replica.',
            'Run the web, worker, and combined release preflight profiles.',
            'Create and verify a PostgreSQL backup before applying migrations.',
            'Apply migrations once through a controlled migration owner.',
            'Deploy the dedicated worker and verify its durable heartbeat.',
            'Deploy the web application with global Studio access still disabled.',
            'Run repository readiness, operations readiness, connected preview, promotion, and rollback acceptance.',
          ],
          code:
            'pnpm exec tsx scripts/flowcordia-installation-preflight.ts --profile web\npnpm exec tsx scripts/flowcordia-installation-preflight.ts --profile worker\npnpm exec tsx scripts/flowcordia-installation-preflight.ts --profile release --json',
        },
        {
          id: 'rollout-boundary',
          title: 'Studio starts disabled',
          paragraphs: [
            'The safe default is FLOWCORDIA_STUDIO_ENABLED=0. Access is granted to a selected internal organization through the organization feature flag only after the database, GitHub integration, worker, repository, and release path are ready.',
            'Green repository CI does not prove that a connected installation is safe. The exact browser-to-GitHub-to-preview-to-runtime-to-promotion-to-rollback path must also be exercised and preserved as evidence.',
          ],
          note:
            'Flowcordia is currently internal alpha. Do not describe the self-hosted path as one-command onboarding or production-ready infrastructure.',
        },
        {
          id: 'current-limitations',
          title: 'What is not finished yet',
          bullets: [
            'No one-command public installer or guided setup flow.',
            'Backup restore, recovery, and upgrade automation are not yet proven as one supported path.',
            'No published high-availability or disaster-recovery topology.',
            'No compatibility, uptime, retention, or support promise.',
            'A preserved connected reference deployment acceptance record is still a release gate.',
          ],
        },
      ]}
      closing={{
        title: 'Deploy from evidence, not optimism.',
        description:
          'Start with the detailed preflight and release-readiness documents. They separate configuration checks, repository CI, live dependency health, and connected acceptance so none is mistaken for another.',
        actions={[
          {
            label: 'Detailed self-hosting docs',
            href: '/docs/self-hosting',
            primary: true,
          },
          {
            label: 'Installation preflight',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/runbooks/installation-preflight.md',
            external: true,
          },
          {
            label: 'Release readiness',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/release-readiness.md',
            external: true,
          },
        ]}
      />
  );
}
