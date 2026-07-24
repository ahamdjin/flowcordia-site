'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Bug,
  Check,
  CircleDot,
  GitBranch,
  GitPullRequest,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';

import GitHubIcon from '@/components/website/icons/github';

type IntentKey = 'question' | 'feedback' | 'bug' | 'contribute';

type Intent = {
  key: IntentKey;
  label: string;
  eyebrow: string;
  title: string;
  message: string;
  destination: string;
  route: [string, string, string];
  href: string;
  cta: string;
  Icon: LucideIcon;
};

const INTENTS: Intent[] = [
  {
    key: 'question',
    label: 'Question',
    eyebrow: 'Architecture question',
    title: 'Ask the community',
    message: 'How should retries behave after a manual approval step?',
    destination: 'Discussions / Q&A',
    route: ['Ask', 'Discuss', 'Answer'],
    href: 'https://github.com/ahamdjin/Flowcordia/discussions/categories/q-a',
    cta: 'Ask on GitHub',
    Icon: MessageSquare,
  },
  {
    key: 'feedback',
    label: 'Feedback',
    eyebrow: 'Product idea',
    title: 'Shape the product',
    message: 'Show the exact source diff before a Studio proposal is created.',
    destination: 'Discussions / Ideas',
    route: ['Share', 'Refine', 'Decide'],
    href: 'https://github.com/ahamdjin/Flowcordia/discussions/categories/ideas',
    cta: 'Share feedback',
    Icon: Lightbulb,
  },
  {
    key: 'bug',
    label: 'Bug',
    eyebrow: 'Reproducible issue',
    title: 'Report a problem',
    message: 'Webhook replay created a duplicate delivery after reconnect.',
    destination: 'Issues / Bug report',
    route: ['Reproduce', 'Triage', 'Fix'],
    href: 'https://github.com/ahamdjin/Flowcordia/issues/new',
    cta: 'Open an issue',
    Icon: Bug,
  },
  {
    key: 'contribute',
    label: 'Contribute',
    eyebrow: 'Code contribution',
    title: 'Build with us',
    message: 'Add a Postgres node with typed inputs, outputs, and failure behavior.',
    destination: 'Contribution guide',
    route: ['Scope', 'Build', 'Review'],
    href: 'https://github.com/ahamdjin/Flowcordia/blob/main/flowcordia/CONTRIBUTING.md',
    cta: 'Read the guide',
    Icon: GitPullRequest,
  },
];

const ACCENT = '#D9A28D';

function RouteStep({
  label,
  index,
  activeKey,
}: {
  label: string;
  index: number;
  activeKey: IntentKey;
}) {
  return (
    <div className='flex min-w-0 flex-1 items-center'>
      <motion.div
        key={`${activeKey}-${label}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.25 }}
        className='relative z-10 flex h-16 min-w-0 flex-1 flex-col justify-center rounded-xl border border-white/[0.08] bg-[#141417] px-3'
      >
        <span className='font-mono text-[8px] tracking-[0.12em] text-zinc-600 uppercase'>
          0{index + 1}
        </span>
        <span className='mt-1 truncate text-xs font-medium text-zinc-300'>
          {label}
        </span>
        {index === 2 && (
          <motion.span
            layoutId='community-route-status'
            className='absolute top-2 right-2 h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: ACCENT }}
          />
        )}
      </motion.div>
      {index < 2 && (
        <div className='relative h-px w-5 shrink-0 bg-white/[0.08] sm:w-8'>
          <motion.div
            key={`${activeKey}-${index}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.14 + index * 0.08, duration: 0.32 }}
            className='absolute inset-0 origin-left'
            style={{ backgroundColor: ACCENT }}
          />
        </div>
      )}
    </div>
  );
}

export function CommunityWorkspace() {
  const [activeKey, setActiveKey] = useState<IntentKey>('question');
  const active = INTENTS.find((intent) => intent.key === activeKey) ?? INTENTS[0];

  return (
    <div className='overflow-hidden rounded-[22px] border border-zinc-800 bg-[#09090b] shadow-[0_36px_120px_rgba(0,0,0,0.28)]'>
      <div className='flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#111114] px-5'>
        <div className='flex min-w-0 items-center gap-4'>
          <div className='flex shrink-0 items-center gap-2' aria-hidden='true'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#ff5f57]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#febc2e]' />
            <span className='h-2.5 w-2.5 rounded-full bg-[#28c840]' />
          </div>
          <span className='truncate font-mono text-[11px] text-zinc-500'>
            community.flow
          </span>
        </div>
        <span className='flex items-center gap-2 font-mono text-[9px] text-zinc-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
          public
        </span>
      </div>

      <div className='grid min-h-[560px] lg:grid-cols-[190px_minmax(0,1fr)_230px]'>
        <aside className='border-b border-white/[0.08] p-3 lg:border-r lg:border-b-0'>
          <div className='px-3 pt-3 pb-4 font-mono text-[8px] tracking-[0.14em] text-zinc-700 uppercase'>
            Start with intent
          </div>
          <div className='grid grid-cols-2 gap-1 lg:grid-cols-1'>
            {INTENTS.map((intent) => {
              const selected = intent.key === activeKey;
              return (
                <button
                  key={intent.key}
                  type='button'
                  onClick={() => setActiveKey(intent.key)}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                    selected
                      ? 'bg-white/[0.07] text-zinc-100'
                      : 'text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300'
                  }`}
                >
                  <intent.Icon className='h-3.5 w-3.5 shrink-0' />
                  <span className='text-xs'>{intent.label}</span>
                  {selected && (
                    <motion.span
                      layoutId='community-intent'
                      className='absolute top-2 bottom-2 left-0 w-px'
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className='mt-8 hidden border-t border-white/[0.06] px-3 pt-5 lg:block'>
            <div className='font-mono text-[8px] text-zinc-700'>repository</div>
            <div className='mt-2 flex items-center gap-2 text-[10px] text-zinc-600'>
              <GitBranch className='h-3 w-3' />
              ahamdjin/Flowcordia
            </div>
          </div>
        </aside>

        <div className='flex min-w-0 flex-col px-5 py-6 sm:px-8 sm:py-8'>
          <div className='flex items-start justify-between gap-6'>
            <div>
              <div className='font-mono text-[8px] tracking-[0.14em] text-zinc-700 uppercase'>
                Incoming
              </div>
              <div className='mt-2 text-sm font-medium text-zinc-300'>
                Route the conversation
              </div>
            </div>
            <div className='hidden rounded-full border border-white/[0.07] px-2.5 py-1 font-mono text-[8px] text-zinc-600 sm:block'>
              no separate forum
            </div>
          </div>

          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className='mt-10 rounded-2xl border border-white/[0.08] bg-[#0d0d10] p-5 sm:p-6'
            >
              <div className='flex items-center justify-between gap-4'>
                <span className='font-mono text-[8px] tracking-[0.12em] text-zinc-600 uppercase'>
                  {active.eyebrow}
                </span>
                <span className='flex items-center gap-1.5 font-mono text-[8px] text-zinc-700'>
                  <CircleDot className='h-3 w-3' /> open
                </span>
              </div>
              <h3 className='mt-5 max-w-xl text-xl font-medium tracking-[-0.025em] text-zinc-100 sm:text-2xl'>
                {active.message}
              </h3>
              <div className='mt-6 flex flex-wrap gap-2'>
                <span className='rounded-md border border-white/[0.07] px-2 py-1 font-mono text-[8px] text-zinc-600'>
                  public
                </span>
                <span className='rounded-md border border-white/[0.07] px-2 py-1 font-mono text-[8px] text-zinc-600'>
                  searchable
                </span>
                <span className='rounded-md border border-white/[0.07] px-2 py-1 font-mono text-[8px] text-zinc-600'>
                  linked to code
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className='mt-auto pt-12'>
            <div className='mb-4 font-mono text-[8px] tracking-[0.14em] text-zinc-700 uppercase'>
              Community route
            </div>
            <div className='flex items-center'>
              {active.route.map((step, index) => (
                <RouteStep
                  key={`${active.key}-${step}`}
                  label={step}
                  index={index}
                  activeKey={active.key}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className='border-t border-white/[0.08] bg-[#0c0c0f] p-6 lg:border-t-0 lg:border-l'>
          <div className='font-mono text-[8px] tracking-[0.14em] text-zinc-700 uppercase'>
            Destination
          </div>

          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={active.key}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2 }}
              className='mt-7'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]'>
                <active.Icon className='h-4 w-4 text-zinc-400' />
              </div>
              <h3 className='mt-5 text-base font-medium text-zinc-200'>{active.title}</h3>
              <p className='mt-2 font-mono text-[10px] leading-5 text-zinc-600'>
                {active.destination}
              </p>

              <div className='mt-8 space-y-3 border-t border-white/[0.06] pt-6'>
                {['Keeps context public', 'Stays beside the repository', 'Can become reviewed work'].map(
                  (item) => (
                    <div key={item} className='flex items-start gap-2 text-[10px] leading-5 text-zinc-600'>
                      <Check className='mt-0.5 h-3 w-3 shrink-0' style={{ color: ACCENT }} />
                      {item}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <a
            href={active.href}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-10 flex h-10 w-full items-center justify-between rounded-lg bg-zinc-100 px-3 text-xs font-medium text-zinc-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
          >
            <span className='flex items-center gap-2'>
              <GitHubIcon className='h-3.5 w-3.5 fill-current' />
              {active.cta}
            </span>
            <ArrowUpRight className='h-3.5 w-3.5' />
          </a>
        </aside>
      </div>

      <div className='flex h-12 items-center justify-between border-t border-white/[0.08] bg-[#111114] px-5 font-mono text-[8px] text-zinc-700'>
        <span className='truncate'>$ flowcordia community --route {active.key}</span>
        <span className='ml-4 flex shrink-0 items-center gap-2'>
          <span className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: ACCENT }} />
          ready
        </span>
      </div>
    </div>
  );
}
