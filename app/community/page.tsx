import type { Metadata } from 'next';
import { ResourcePage } from '@/components/website/resource-page';

export const metadata: Metadata = {
  title: 'Community - Flowcordia',
  description:
    'Join Flowcordia discussions, report bugs, propose features, and contribute to the open-source project.',
};

export default function CommunityPage() {
  return (
    <ResourcePage
      eyebrow='Community'
      title='Build the connected workflow platform in public.'
      description='Flowcordia’s community currently lives where the code and product decisions live: GitHub. There is no separate forum to keep alive artificially. Discussions, issues, proposals, and contributions remain connected to the repository.'
      actions={[
        {
          label: 'Join discussions',
          href: 'https://github.com/ahamdjin/Flowcordia/discussions',
          external: true,
          primary: true,
        },
        {
          label: 'Browse issues',
          href: 'https://github.com/ahamdjin/Flowcordia/issues',
          external: true,
        },
      ]}
      sections={[
        {
          id: 'where-to-go',
          title: 'Choose the right place',
          cards: [
            {
              title: 'Questions and product discussion',
              description:
                'Use GitHub Discussions for architecture questions, product feedback, use cases, design ideas, and open-ended proposals.',
              href: 'https://github.com/ahamdjin/Flowcordia/discussions',
              external: true,
            },
            {
              title: 'Reproducible bugs',
              description:
                'Use GitHub Issues when a problem has a clear environment, expected behavior, actual behavior, and reproduction path.',
              href: 'https://github.com/ahamdjin/Flowcordia/issues/new',
              external: true,
            },
            {
              title: 'Scoped feature work',
              description:
                'Open an issue for a specific product boundary after discussing broader direction when needed.',
              href: 'https://github.com/ahamdjin/Flowcordia/issues',
              external: true,
            },
            {
              title: 'Code and documentation',
              description:
                'Read the contribution discipline before opening a pull request. Flowcordia values connected completeness over visible surface area.',
              href: '/contributing',
            },
          ],
        },
        {
          id: 'good-feedback',
          title: 'What useful feedback looks like',
          bullets: [
            'Describe the operator or user outcome before suggesting implementation.',
            'Explain which workflow, repository, runtime, policy, or deployment boundary is involved.',
            'Include exact versions and safe reproduction details.',
            'Separate what happened in repository tests from what happened in a connected environment.',
            'Do not paste credentials, environment files, raw provider payloads, or private customer data.',
          ],
        },
        {
          id: 'project-values',
          title: 'Project values',
          cards: [
            {
              title: 'One connected product',
              description:
                'Canvas, code, Git review, deployment, runtime evidence, failure behavior, and documentation must agree.',
            },
            {
              title: 'Honest maturity',
              description:
                'Internal-alpha behavior is described as internal alpha. Missing live evidence is not replaced with confident copy.',
            },
            {
              title: 'Existing systems first',
              description:
                'Flowcordia reuses GitHub and Trigger.dev ownership instead of duplicating mature subsystems without reason.',
            },
            {
              title: 'Failure is part of the design',
              description:
                'Retries, timeouts, ambiguous writes, reconciliation, rollback, and recovery belong in the original change boundary.',
            },
          ],
        },
        {
          id: 'community-home',
          title: 'Why there is no community subdomain yet',
          paragraphs: [
            'A separate community platform only helps when there are enough recurring conversations, contributors, moderation needs, and searchable answers to justify another system. For now, GitHub keeps discussion beside the code and avoids an empty branded forum.',
            'A dedicated community site can be introduced later without changing the public route. This page will remain the stable entry point.',
          ],
        },
        {
          id: 'conduct',
          title: 'How to participate',
          bullets: [
            'Be specific, respectful, and willing to separate evidence from assumptions.',
            'Critique systems and decisions rather than people.',
            'Avoid flooding issues with overlapping requests; continue relevant discussions in one place.',
            'Do not pressure maintainers to merge incomplete or unverified work.',
            'Help improve reproduction steps, documentation, tests, and failure cases—not only visible features.',
          ],
        },
      ]}
      closing={{
        title: 'Start with the conversation closest to your intent.',
        description:
          'Use Discussions for questions and direction, Issues for scoped work, and the contribution guide before proposing code.',
        actions: [
          {
            label: 'GitHub Discussions',
            href: 'https://github.com/ahamdjin/Flowcordia/discussions',
            external: true,
            primary: true,
          },
          {
            label: 'Contributing guide',
            href: '/contributing',
          },
          {
            label: 'Roadmap',
            href: '/roadmap',
          },
        ],
      }}
    />
  );
}
