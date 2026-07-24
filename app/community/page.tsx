import type { Metadata } from 'next';
import {
  ArrowRight,
  Bug,
  GitPullRequest,
  MessagesSquare,
} from 'lucide-react';
import { Header } from '@/components/website/header';
import { SiteFooter } from '@/components/website/site-footer';
import GitHubIcon from '@/components/website/icons/github';

export const metadata: Metadata = {
  title: 'Community - Flowcordia',
  description:
    'Ask questions, share feedback, report issues, and contribute to Flowcordia on GitHub.',
};

const linkClassName =
  'group grid gap-6 border-t border-zinc-200 py-10 transition-colors hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 md:grid-cols-[5rem_minmax(0,1fr)_12rem_2rem] md:items-center dark:border-zinc-800 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950';

export default function CommunityPage() {
  return (
    <>
      <Header />
      <main className='overflow-hidden'>
        <section className='mx-auto w-full max-w-7xl px-6 lg:px-8'>
          <div className='max-w-4xl pt-24 sm:pt-32 lg:pt-40'>
            <div className='flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-zinc-50' />
              Community
            </div>

            <h1 className='mt-8 max-w-4xl text-5xl leading-[1.02] font-medium tracking-[-0.045em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-zinc-50'>
              Built in public.
              <br />
              Better with people.
            </h1>

            <p className='mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'>
              The website is the front door. GitHub is where questions,
              feedback, decisions, and contributions stay connected to the
              product.
            </p>

            <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:items-center'>
              <a
                href='https://github.com/ahamdjin/Flowcordia/discussions'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-4 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950'
              >
                <MessagesSquare className='h-4 w-4' />
                Join the discussion
              </a>
              <a
                href='https://github.com/ahamdjin/Flowcordia'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-white dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950'
              >
                <GitHubIcon className='h-4 w-4 fill-current' />
                View the repository
              </a>
            </div>

            <p className='mt-6 text-sm text-zinc-500 dark:text-zinc-400'>
              Flowcordia is currently internal alpha. Feedback is welcome;
              support guarantees are not available yet.
            </p>
          </div>
        </section>

        <section className='mx-auto mt-36 w-full max-w-7xl px-6 sm:mt-48 lg:px-8'>
          <div className='max-w-2xl'>
            <p className='font-mono text-[11px] tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400'>
              Choose the right place
            </p>
            <h2 className='mt-5 text-3xl font-medium tracking-[-0.03em] text-zinc-950 sm:text-4xl dark:text-zinc-50'>
              One home. Three clear paths.
            </h2>
          </div>

          <div className='mt-16 border-b border-zinc-200 dark:border-zinc-800'>
            <a
              href='https://github.com/ahamdjin/Flowcordia/discussions'
              target='_blank'
              rel='noopener noreferrer'
              className={linkClassName}
            >
              <span className='font-mono text-xs text-zinc-400 dark:text-zinc-600'>
                01
              </span>
              <div>
                <div className='flex items-center gap-3'>
                  <MessagesSquare className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
                  <h3 className='text-xl font-medium tracking-[-0.02em] text-zinc-950 dark:text-zinc-50'>
                    Ask, share, and shape direction.
                  </h3>
                </div>
                <p className='mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300'>
                  Use Discussions for questions, product feedback, use cases,
                  architecture ideas, and anything that should begin as a
                  conversation.
                </p>
              </div>
              <span className='text-sm text-zinc-500 md:text-right dark:text-zinc-400'>
                GitHub Discussions
              </span>
              <ArrowRight className='h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-600' />
            </a>

            <a
              href='https://github.com/ahamdjin/Flowcordia/issues'
              target='_blank'
              rel='noopener noreferrer'
              className={linkClassName}
            >
              <span className='font-mono text-xs text-zinc-400 dark:text-zinc-600'>
                02
              </span>
              <div>
                <div className='flex items-center gap-3'>
                  <Bug className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
                  <h3 className='text-xl font-medium tracking-[-0.02em] text-zinc-950 dark:text-zinc-50'>
                    Report a reproducible problem.
                  </h3>
                </div>
                <p className='mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300'>
                  Use Issues for confirmed bugs and scoped requests with a
                  clear outcome, environment, and safe reproduction path.
                </p>
              </div>
              <span className='text-sm text-zinc-500 md:text-right dark:text-zinc-400'>
                GitHub Issues
              </span>
              <ArrowRight className='h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-600' />
            </a>

            <a
              href='https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/CONTRIBUTING.md'
              target='_blank'
              rel='noopener noreferrer'
              className={linkClassName}
            >
              <span className='font-mono text-xs text-zinc-400 dark:text-zinc-600'>
                03
              </span>
              <div>
                <div className='flex items-center gap-3'>
                  <GitPullRequest className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
                  <h3 className='text-xl font-medium tracking-[-0.02em] text-zinc-950 dark:text-zinc-50'>
                    Contribute code or documentation.
                  </h3>
                </div>
                <p className='mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300'>
                  Start from the current verified main branch and keep each
                  pull request focused on one complete, reviewable product
                  outcome.
                </p>
              </div>
              <span className='text-sm text-zinc-500 md:text-right dark:text-zinc-400'>
                Contribution guide
              </span>
              <ArrowRight className='h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-600' />
            </a>
          </div>
        </section>

        <section className='mx-auto w-full max-w-7xl px-6 py-36 sm:py-48 lg:px-8'>
          <div className='grid gap-12 border-t border-zinc-200 pt-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-24 dark:border-zinc-800'>
            <p className='font-mono text-[11px] tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400'>
              Why GitHub, for now
            </p>
            <div>
              <h2 className='max-w-2xl text-3xl font-medium tracking-[-0.03em] text-zinc-950 sm:text-4xl dark:text-zinc-50'>
                One less place to keep alive.
              </h2>
              <p className='mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'>
                Keeping the community beside the code makes answers searchable,
                decisions traceable, and contributions easier to turn into real
                work. A real-time community can come later when the people and
                conversations genuinely need it.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
