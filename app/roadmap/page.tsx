import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Roadmap - Flowcordia',
  description:
    'See what Flowcordia has implemented, what blocks private beta, and which capabilities belong to later product stages.',
};

export default function RoadmapPage() {
  return (
    <ResourcePage
      eyebrow='Roadmap'
      title='Progress is measured by connected evidence.'
      description='Flowcordia does not mark a capability complete because a screen exists or a test passes in isolation. The roadmap follows product maturity: implemented contracts first, connected acceptance next, then repeatable operations and broader platform capabilities.'
      actions={[
        {
          label: 'Capability matrix',
          href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/capability-matrix.md',
          external: true,
          primary: true,
        },
        {
          label: 'Open issues',
          href: 'https://github.com/ahamdjin/Flowcordia/issues',
          external: true,
        },
      ]}
      sections={[
        {
          id: 'current-stage',
          title: 'Current stage: internal alpha',
          paragraphs: [
            'The repository contains connected contracts for workflow discovery, durable Studio drafts, deterministic compilation, governed GitHub proposals, typed repository functions, preview deployment correlation, exact-head validation, policy evidence, promotion, audit, outbox processing, and reconciliation.',
            'The remaining release risk is primarily connected acceptance, operator experience, backups and recovery, upgrades, provider health, and production operations—not a lack of isolated backend foundations.',
          ],
          note:
            'No uptime, compatibility, recovery, or production-support promise is made at the internal-alpha stage.',
        },
        {
          id: 'implemented',
          title: 'Implemented foundations',
          bullets: [
            'Repository-backed discovery from .flowcordia/workflows/*.json.',
            'Durable Studio drafts with optimistic versioning and stale-source protection.',
            'Visual editing for the bounded first-party node catalog.',
            'Deterministic compilation into Trigger.dev task source.',
            'Governed proposal branches and pull requests tied to exact base and head commits.',
            'Exact-head approvals, checks, policy evidence, and fail-closed promotion.',
            'Repository-owned typed functions declared through .flowcordia/functions.json.',
            'Version-locked runs with proposal, head, worker, and idempotency correlation.',
            'Durable audit, outbox, reconciliation, bounded retries, and browser-safe projections.',
            'Secret-safe installation preflight and bounded live dependency checks.',
          ],
        },
        {
          id: 'next-gates',
          title: 'Next release gates',
          description:
            'These are the shortest path from internal alpha to a credible private beta.',
          cards: [
            {
              title: 'Connected acceptance record',
              description:
                'Preserve one browser-to-GitHub-to-preview-to-execution-to-promotion-to-rollback run tied to exact commits and deployment versions.',
            },
            {
              title: 'Repeatable installation and upgrades',
              description:
                'Turn the current preflight and runbooks into one tested operator path with explicit migrations, compatibility, backups, and rollback.',
            },
            {
              title: 'Primary workflow UX',
              description:
                'Remove raw JSON from the supported first-party path and prove a non-maintainer can complete the core journey.',
            },
            {
              title: 'Production operations',
              description:
                'Assign telemetry, alerting, provider-health, recovery, and incident ownership for supported deployments.',
            },
          ],
        },
        {
          id: 'later-product',
          title: 'Later product phases',
          bullets: [
            'Public signed webhook ingress.',
            'Human approvals, subflows, batch and parallel control, and realtime streaming.',
            'Broader configuration forms for advanced visual nodes.',
            'Guided repository bootstrap and onboarding.',
            'Release artifacts, versioned migrations, and compatibility policy.',
            'SSO, SCIM, broader enterprise policy, and retention controls.',
            'Supported high availability, backup objectives, disaster recovery, and tested restores.',
          ],
        },
        {
          id: 'stage-model',
          title: 'Maturity stages',
          cards: [
            {
              title: 'Internal alpha',
              description:
                'Selected operators, strong repository evidence, manual connected runs, and no operational promises.',
            },
            {
              title: 'Private beta',
              description:
                'Connected acceptance, repeatable installation, tested rollback, telemetry ownership, and a non-maintainer core journey.',
            },
            {
              title: 'Public beta',
              description:
                'Public security reporting, release artifacts, guided onboarding, compatibility boundaries, and outage/recovery testing.',
            },
            {
              title: 'General availability',
              description:
                'Supported HA, disaster recovery, controlled upgrades, and governance claims backed by production evidence.',
            },
          ],
        },
        {
          id: 'how-to-participate',
          title: 'How roadmap decisions are made',
          paragraphs: [
            'The capability matrix records delivered, partial, inherited, and planned behavior. Issues are useful for discussion and implementation tracking, but they do not replace the release-readiness gates or connected evidence.',
          ],
          bullets: [
            'Use GitHub Discussions for product questions and design proposals.',
            'Use Issues for reproducible bugs and scoped feature work.',
            'Tie implementation claims to the exact final commit and tests.',
            'Keep planned behavior in the roadmap instead of describing it as shipped documentation.',
          ],
        },
      ]}
      closing={{
        title: 'The roadmap stays public and falsifiable.',
        description:
          'Read the capability matrix for line-by-line coverage or the release-readiness document for the exact evidence required at each maturity stage.',
        actions={[
          {
            label: 'Capability matrix',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/capability-matrix.md',
            external: true,
            primary: true,
          },
          {
            label: 'Release readiness',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/release-readiness.md',
            external: true,
          },
          {
            label: 'Discuss the roadmap',
            href: 'https://github.com/ahamdjin/Flowcordia/discussions',
            external: true,
          },
        ]}
      />
  );
}
