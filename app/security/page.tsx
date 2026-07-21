import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Security - Flowcordia',
  description:
    'Review Flowcordia’s trust boundaries, secret handling, authorization model, fail-closed behavior, and current security-reporting status.',
};

export default function SecurityPage() {
  return (
    <ResourcePage
      eyebrow='Security'
      title='Security boundaries are part of the workflow contract.'
      description='Flowcordia connects browser authoring, repository collaboration, durable control-plane state, deployment providers, and runtime execution. Each boundary must identify who supplies identity, where secrets live, what the browser may see, and how uncertain remote outcomes are reconciled.'
      actions={[
        {
          label: 'Read security documentation',
          href: 'https://github.com/ahamdjin/Flowcordia/tree/main/flowcordia/security',
          external: true,
          primary: true,
        },
        {
          label: 'Security docs',
          href: '/docs/security',
        },
      ]}
      sections={[
        {
          id: 'trust-model',
          title: 'Core trust model',
          bullets: [
            'The browser does not choose tenant, organization, installation, repository, branch, actor, database identity, worker, credentials, or policy identity.',
            'Repository and runtime identities are resolved and authorized on trusted server boundaries.',
            'Unreviewed repository code does not execute inside the web application process.',
            'The exact proposal head is part of executable identity; a changed head requires fresh validation and policy evidence.',
            'Unsupported runtime intent fails publication rather than being silently omitted.',
          ],
        },
        {
          id: 'secrets',
          title: 'Secrets are referenced, not copied',
          paragraphs: [
            'Workflow documents and generated task source may reference secret names, but secret values remain in the operator-controlled runtime and credential systems that own them.',
          ],
          bullets: [
            'No secret values in workflow JSON or generated source.',
            'No credentials in audit payloads or browser projections.',
            'No environment values, lengths, hosts, IDs, URLs, or key fragments in installation-preflight output.',
            'No raw provider errors exposed directly to the browser.',
            'Release evidence must stay safe for a public repository.',
          ],
        },
        {
          id: 'authorization',
          title: 'Authorization follows exact resource identity',
          cards: [
            {
              title: 'Repository scope',
              description:
                'GitHub installation, repository, branch, commit, and path are resolved against server-owned project configuration.',
            },
            {
              title: 'Proposal scope',
              description:
                'Drafts, branches, pull requests, checks, approvals, and promotion remain bound to the expected base and exact head.',
            },
            {
              title: 'Runtime scope',
              description:
                'Runs correlate workflow, proposal, commit, deployment, worker, and idempotency identity before evidence is trusted.',
            },
            {
              title: 'Policy scope',
              description:
                'Fresh policy selection and evidence are required at promotion; stale approval does not authorize a changed executable head.',
            },
          ],
        },
        {
          id: 'failure-behavior',
          title: 'Fail closed and reconcile uncertainty',
          bullets: [
            'Unknown remote write outcomes are reconciled before another mutation is attempted.',
            'Rate limits, timeouts, provider outages, stale identities, and duplicate requests have bounded behavior.',
            'Missing, truncated, stale, or mismatched GitHub evidence blocks promotion.',
            'A passing configuration preflight cannot override failed live health, repository readiness, policy, production, or rollback checks.',
            'Feature flags control rollout; they are not evidence that a feature works.',
          ],
        },
        {
          id: 'reporting',
          title: 'Security reporting status',
          paragraphs: [
            'Flowcordia is internal alpha and does not yet publish a dedicated private vulnerability-reporting channel. Establishing that process is an explicit public-beta release gate.',
            'Do not post credentials, exploit details, private repository data, customer payloads, or secret-like values in public Issues or Discussions. Non-sensitive hardening suggestions and documentation defects may be reported through GitHub Issues.',
          ],
          note:
            'Because a private reporting channel is not yet published, Flowcordia should not be presented as ready for public production workloads.',
        },
        {
          id: 'current-boundary',
          title: 'Current security boundary',
          bullets: [
            'Repository authorization, browser redaction, exact-head validation, policy evidence, and secret-reference contracts are implemented and tested.',
            'Public signed webhook ingress is not complete.',
            'SSO, SCIM, broader enterprise policy, retention controls, HA, and disaster recovery belong to later maturity stages.',
            'Connected acceptance and operational recovery evidence remain release gates.',
          ],
        },
      ]}
      closing={{
        title: 'Review the threat boundaries before deploying.',
        description:
          'The repository security directory, architecture records, connection registry, and release-readiness gates are the authoritative sources for delivered behavior and known limitations.',
        actions: [
          {
            label: 'Security directory',
            href: 'https://github.com/ahamdjin/Flowcordia/tree/main/flowcordia/security',
            external: true,
            primary: true,
          },
          {
            label: 'Release readiness',
            href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/product/release-readiness.md',
            external: true,
          },
          {
            label: 'Non-sensitive issue',
            href: 'https://github.com/ahamdjin/Flowcordia/issues/new',
            external: true,
          },
        ],
      }}
    />
  );
}
