import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';

import { CommunityWorkspace } from '@/components/website/community-workspace';
import { Header } from '@/components/website/header';
import { SiteFooter } from '@/components/website/site-footer';

export const metadata: Metadata = {
  title: 'Community - Flowcordia',
  description:
    'Ask questions, share feedback, report issues, and contribute to Flowcordia through its GitHub community.',
};

export default function CommunityPage() {
  return (
    <>
      <Header />
      <main>
        <section className='mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-32 lg:px-8 lg:pt-40'>
          <div className='max-w-3xl'>
            <p className='font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400'>
              Community
            </p>
            <h1 className='mt-7 text-5xl leading-[1.03] font-medium tracking-[-0.045em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-zinc-50'>
              Questions, feedback,
              <br />
              and code—connected.
            </h1>
            <p className='mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300'>
              Flowcordia keeps community conversations beside the repository, so
              an idea can become a decision, an issue, and a reviewed change
              without disappearing into another platform.
            </p>
          </div>

          <div className='mt-20 sm:mt-28'>
            <CommunityWorkspace />
          </div>
        </section>

        <section className='mx-auto w-full max-w-7xl px-6 py-40 sm:py-52 lg:px-8'>
          <div className='grid gap-12 border-t border-zinc-200 pt-12 md:grid-cols-[220px_minmax(0,1fr)] md:gap-20 dark:border-zinc-800'>
            <p className='font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400'>
              One community home
            </p>
            <div className='max-w-2xl'>
              <h2 className='text-3xl font-medium tracking-[-0.035em] text-zinc-950 sm:text-4xl dark:text-zinc-50'>
                GitHub, for now.
              </h2>
              <p className='mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300'>
                No empty Slack. No separate forum to maintain. Questions stay
                searchable, feedback stays visible, and contributions stay close
                to the code they affect.
              </p>
              <div className='mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm'>
                <a
                  href='https://github.com/ahamdjin/Flowcordia/discussions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50'
                >
                  Discussions
                  <ArrowUpRight className='h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                </a>
                <a
                  href='https://github.com/ahamdjin/Flowcordia/issues'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50'
                >
                  Issues
                  <ArrowUpRight className='h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                </a>
                <a
                  href='https://github.com/ahamdjin/Flowcordia'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-2 font-medium text-zinc-950 dark:text-zinc-50'
                >
                  Repository
                  <ArrowUpRight className='h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
