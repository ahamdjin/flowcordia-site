'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from '@/components/core/morphing-dialog';

const TARGETS = {
  cloud: {
    label: 'Flowcordia Cloud',
    shortLabel: 'Cloud',
    eyebrow: 'Managed execution',
    location: 'Flowcordia-managed workers',
    network: 'Public APIs and services',
    secrets: 'Encrypted project secrets',
    telemetry: 'Managed run telemetry',
    workerPool: 'managed-us-east',
    explanation:
      'Flowcordia provisions and operates the workers. The reviewed workflow version remains pinned to Git.',
  },
  vpc: {
    label: 'Private VPC',
    shortLabel: 'Private VPC',
    eyebrow: 'Private execution',
    location: 'Workers inside your VPC',
    network: 'Internal APIs and databases',
    secrets: 'Your cloud secret manager',
    telemetry: 'Configurable outbound telemetry',
    workerPool: 'production-private',
    explanation:
      'The control plane coordinates the run while execution, credentials, and private service access stay inside your network.',
  },
  selfHosted: {
    label: 'Self-hosted workers',
    shortLabel: 'Self-hosted',
    eyebrow: 'Owned execution',
    location: 'Your hosts or cluster',
    network: 'Your network boundary',
    secrets: 'Environment, Vault, or KMS',
    telemetry: 'You choose what leaves',
    workerPool: 'release-workers',
    explanation:
      'Run the worker on infrastructure you operate. Flowcordia never needs direct access to the systems the workflow touches.',
  },
} as const;

type TargetKey = keyof typeof TARGETS;

const TARGET_ORDER: TargetKey[] = ['cloud', 'vpc', 'selfHosted'];

function useTargetSequence(play: boolean) {
  const [target, setTarget] = useState<TargetKey>('cloud');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!play) return;

    if (reduceMotion) {
      setTarget('vpc');
      return;
    }

    setTarget('cloud');
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % TARGET_ORDER.length;
      setTarget(TARGET_ORDER[index]);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [play, reduceMotion]);

  return target;
}

function NodeFrame({
  eyebrow,
  title,
  detail,
  active = false,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative min-w-0 rounded-xl border bg-white px-4 py-4 text-left shadow-[0_1px_2px_rgba(9,9,11,0.03)] transition-colors dark:bg-zinc-950 ${
        active
          ? 'border-[#D9A28D]/70'
          : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      {active && (
        <motion.span
          aria-hidden='true'
          className='absolute top-3 right-3 h-2 w-2 rounded-full bg-[#D9A28D]'
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div className='text-[8px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
        {eyebrow}
      </div>
      <div className='mt-2 truncate text-sm font-medium text-zinc-950 dark:text-zinc-50'>
        {title}
      </div>
      <div className='mt-1 truncate font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
        {detail}
      </div>
    </div>
  );
}

function Connector({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      aria-hidden='true'
      className={`flex items-center justify-center text-zinc-300 dark:text-zinc-700 ${
        vertical ? 'h-8' : 'w-10'
      }`}
    >
      <span className='font-mono text-sm'>{vertical ? '↓' : '→'}</span>
    </div>
  );
}

function ArchitectureDiagram({
  target,
  expanded = false,
}: {
  target: TargetKey;
  expanded?: boolean;
}) {
  const current = TARGETS[target];

  return (
    <div>
      <div className='flex flex-col items-stretch sm:grid sm:grid-cols-[1fr_40px_1fr_40px_1fr] sm:items-center'>
        <NodeFrame
          eyebrow='Source of truth'
          title='Git repository'
          detail='release.workflow.ts · 7f91b2d'
        />
        <div className='sm:hidden'>
          <Connector vertical />
        </div>
        <div className='hidden sm:block'>
          <Connector />
        </div>
        <NodeFrame
          eyebrow='Coordination'
          title='Flowcordia control plane'
          detail='schedule · state · policy'
        />
        <div className='sm:hidden'>
          <Connector vertical />
        </div>
        <div className='hidden sm:block'>
          <Connector />
        </div>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={target}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <NodeFrame
              eyebrow={current.eyebrow}
              title={current.label}
              detail={current.workerPool}
              active
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={`mt-5 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 ${
          expanded ? 'sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {[
          ['Source', 'Stays in Git'],
          ['Secrets', target === 'cloud' ? 'Project encrypted' : 'Stay in your environment'],
          ['Execution', current.location],
        ].map(([label, value]) => (
          <div key={label} className='bg-zinc-50 px-4 py-3 dark:bg-zinc-900/70'>
            <div className='text-[8px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              {label}
            </div>
            <div className='mt-1 text-[11px] font-medium text-zinc-800 dark:text-zinc-200'>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosedPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { amount: 0.45 });
  const target = useTargetSequence(inView);
  const current = TARGETS[target];

  return (
    <div ref={previewRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='min-h-0 flex-1 border-t border-zinc-200 px-6 py-7 sm:px-9 sm:py-8 dark:border-zinc-800'>
        <div className='mb-5 flex items-center justify-between gap-4'>
          <span className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
            Execution boundary
          </span>
          <AnimatePresence mode='wait' initial={false}>
            <motion.span
              key={target}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'
            >
              {current.shortLabel}
            </motion.span>
          </AnimatePresence>
        </div>
        <ArchitectureDiagram target={target} />
      </div>

      <div className='flex items-end justify-between gap-6 border-t border-zinc-200 px-6 py-5 sm:px-9 dark:border-zinc-800'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={target}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            aria-live='polite'
          >
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              Same workflow. {current.shortLabel} execution.
            </div>
            <div className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
              Commit 7f91b2d stays pinned while the execution boundary changes.
            </div>
          </motion.div>
        </AnimatePresence>
        <span className='hidden shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 sm:block dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Choose your boundary →
        </span>
      </div>
    </div>
  );
}

function BoundaryDetail({ target }: { target: TargetKey }) {
  const current = TARGETS[target];
  const rows = [
    ['Worker location', current.location],
    ['Network access', current.network],
    ['Secret source', current.secrets],
    ['Telemetry', current.telemetry],
  ];

  return (
    <div className='overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800'>
      <div className='border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Ownership boundary
        </div>
      </div>
      <div className='divide-y divide-zinc-200 dark:divide-zinc-800'>
        {rows.map(([label, value]) => (
          <div key={label} className='flex items-start justify-between gap-6 px-4 py-3'>
            <span className='text-[11px] text-zinc-500 dark:text-zinc-400'>
              {label}
            </span>
            <span className='max-w-[220px] text-right text-[11px] font-medium text-zinc-900 dark:text-zinc-100'>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeploymentConfig({ target }: { target: TargetKey }) {
  const current = TARGETS[target];

  return (
    <div className='overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-left'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[9px] text-zinc-500'>
        <span>flowcordia.config.ts</span>
        <span>commit 7f91b2d</span>
      </div>
      <div className='px-4 py-4 font-mono text-[10px] leading-6 text-zinc-400 sm:text-[11px]'>
        <div><span className='text-violet-300'>execution</span>: {'{'}</div>
        <div className='pl-4'>target: <span className='text-emerald-300'>&quot;{target === 'selfHosted' ? 'self-hosted' : target}&quot;</span>,</div>
        <div className='pl-4'>workerPool: <span className='text-emerald-300'>&quot;{current.workerPool}&quot;</span>,</div>
        <div className='pl-4'>commit: <span className='text-emerald-300'>&quot;7f91b2d&quot;</span>,</div>
        <div>{'}'}</div>
      </div>
    </div>
  );
}

function InfrastructureWorkspace() {
  const [target, setTarget] = useState<TargetKey>('vpc');
  const current = TARGETS[target];

  return (
    <div className='border-t border-zinc-200 dark:border-zinc-800'>
      <div className='border-b border-zinc-200 px-6 py-4 sm:px-9 dark:border-zinc-800'>
        <div className='grid grid-cols-3 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/60'>
          {TARGET_ORDER.map((key) => (
            <button
              key={key}
              type='button'
              onClick={() => setTarget(key)}
              className={`rounded-md px-2 py-2 text-[11px] font-medium transition-colors focus-visible:ring-1 focus-visible:ring-[#D9A28D] focus-visible:outline-none sm:text-xs ${
                target === key
                  ? 'bg-white text-zinc-950 shadow-[0_1px_2px_rgba(9,9,11,0.06)] dark:bg-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {TARGETS[key].shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className='p-6 sm:p-9'>
        <ArchitectureDiagram target={target} expanded />

        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={target}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className='mt-7 grid gap-5 md:grid-cols-[1fr_1fr]'
          >
            <div>
              <BoundaryDetail target={target} />
              <p className='mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
                {current.explanation}
              </p>
            </div>
            <DeploymentConfig target={target} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='grid gap-px border-t border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3'>
        {[
          ['Git remains authoritative', 'The deployed version always resolves to an exact reviewed commit.'],
          ['Secrets follow the worker', 'Private targets resolve credentials inside the execution environment.'],
          ['Control stays explicit', 'Network and telemetry boundaries change only through configuration.'],
        ].map(([title, detail]) => (
          <div key={title} className='bg-white px-6 py-5 dark:bg-zinc-950'>
            <div className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
              {title}
            </div>
            <p className='mt-2 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400'>
              {detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfrastructureControlWorkflow() {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.04,
        duration: 0.32,
      }}
    >
      <MorphingDialogTrigger
        style={{ borderRadius: '12px' }}
        className='group flex h-full w-full flex-col overflow-hidden bg-white text-left dark:bg-zinc-950'
      >
        <div className='flex items-start justify-between gap-8 px-7 pt-7 pb-6 sm:px-10 sm:pt-10 sm:pb-8'>
          <div className='max-w-xl'>
            <div className='text-[10px] font-medium tracking-[0.09em] text-zinc-400 uppercase dark:text-zinc-500'>
              04 · Infrastructure control
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Run workflows on your infrastructure.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Use managed workers, connect a private VPC, or bring your own runtime without changing the reviewed workflow.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            commit 7f91b2d
          </div>
        </div>
        <ClosedPreview />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: '24px' }}
          className='pointer-events-auto relative flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[980px] flex-col overflow-y-auto border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-950'
        >
          <div className='px-7 pt-7 pb-6 pr-16 sm:px-9 sm:pt-9 sm:pb-8'>
            <div className='text-[10px] font-medium tracking-[0.09em] text-zinc-400 uppercase dark:text-zinc-500'>
              Execution boundary
            </div>
            <MorphingDialogTitle className='mt-3 max-w-2xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Same workflow. Your infrastructure rules.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Choose where execution happens and inspect what Flowcordia coordinates, what remains private, and which exact commit runs.
            </MorphingDialogSubtitle>
          </div>

          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 12 },
            }}
          >
            <InfrastructureWorkspace />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
