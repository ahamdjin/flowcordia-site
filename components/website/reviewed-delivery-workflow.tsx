'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const CHECKS = [
  'Schema validation',
  'Generated source',
  'Build fixture',
  'Workflow simulation',
] as const;

const PHASE_COPY = [
  {
    title: 'Change detected',
    detail: 'Approval timeout · 24h → 2h',
  },
  {
    title: 'Exact source diff generated',
    detail: 'workflow/release.workflow.ts',
  },
  {
    title: 'Proposal #184 created',
    detail: '1 file changed',
  },
  {
    title: 'Validating workflow contract',
    detail: 'Schema validation',
  },
  {
    title: 'Confirming generated source',
    detail: 'Source and canvas agree',
  },
  {
    title: 'Building the reference fixture',
    detail: 'Production build',
  },
  {
    title: 'Running workflow simulation',
    detail: 'Two release paths',
  },
  {
    title: 'Preview verified',
    detail: 'Ready for developer review',
  },
  {
    title: 'Production updated safely',
    detail: '4 checks passed · commit 7f91b2d',
  },
] as const;

function useDeliverySequence(play: boolean) {
  const [phase, setPhase] = useState(0);
  const [sequenceKey, setSequenceKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!play) return;

    if (reduceMotion) {
      setPhase(PHASE_COPY.length - 1);
      return;
    }

    setPhase(0);
    const marks = [700, 1450, 2200, 3000, 3750, 4500, 5250, 6250];
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );

    timers.push(
      window.setTimeout(
        () => setSequenceKey((current) => current + 1),
        8800
      )
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [play, reduceMotion, sequenceKey]);

  return phase;
}

function StatusMark({ complete, active }: { complete: boolean; active: boolean }) {
  return (
    <span className='relative flex h-4 w-4 shrink-0 items-center justify-center'>
      {active && (
        <motion.span
          aria-hidden='true'
          className='absolute h-4 w-4 rounded-full bg-[#D9A28D]/20'
          animate={{ scale: [0.75, 1.35, 0.75], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span
        aria-hidden='true'
        className={`relative h-2 w-2 rounded-full border transition-colors duration-300 ${
          active
            ? 'border-[#D9A28D] bg-[#D9A28D]'
            : complete
              ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
              : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
        }`}
      />
    </span>
  );
}

function ReviewTimeline({ phase }: { phase: number }) {
  const rows = [
    { label: 'Proposal created', threshold: 2 },
    ...CHECKS.map((label, index) => ({ label, threshold: index + 3 })),
    { label: 'Preview verified', threshold: 7 },
    { label: 'Production updated', threshold: 8 },
  ];

  return (
    <div className='space-y-3.5'>
      {rows.map((row) => {
        const complete = phase >= row.threshold;
        const active = phase === row.threshold - 1;

        return (
          <div key={row.label} className='flex items-center gap-3'>
            <StatusMark complete={complete} active={active} />
            <span
              className={`text-xs transition-colors duration-300 ${
                complete || active
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-600'
              }`}
            >
              {row.label}
            </span>
            {complete && (
              <span className='ml-auto font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
                passed
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SourceDiff({ revealed }: { revealed: boolean }) {
  return (
    <div className='overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 text-left shadow-[0_1px_2px_rgba(9,9,11,0.04)] dark:border-zinc-800'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[9px] text-zinc-500'>
        <span>workflow/release.workflow.ts</span>
        <span>1 change</span>
      </div>
      <div className='px-4 py-4 font-mono text-[10px] leading-7 sm:text-[11px]'>
        <div className='text-zinc-600'>steps: [</div>
        <div className='pl-4 text-zinc-500'>deployPreview(),</div>
        <div className='rounded bg-red-500/8 px-2 text-red-300'>
          - awaitApproval({'{ timeout: "24h" }'}),
        </div>
        <motion.div
          className='rounded bg-emerald-500/8 px-2 text-emerald-300'
          animate={{ opacity: revealed ? 1 : 0.18, y: revealed ? 0 : 4 }}
          transition={{ duration: 0.35 }}
        >
          + awaitApproval({'{ timeout: "2h" }'}),
        </motion.div>
        <div className='pl-4 text-zinc-500'>promote(),</div>
        <div className='text-zinc-600'>]</div>
      </div>
    </div>
  );
}

function ClosedPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { amount: 0.45 });
  const phase = useDeliverySequence(inView);
  const current = PHASE_COPY[phase];

  return (
    <div ref={previewRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='grid min-h-0 flex-1 border-t border-zinc-200 dark:border-zinc-800 sm:grid-cols-[1.08fr_0.92fr]'>
        <div className='flex min-h-0 flex-col p-6 sm:border-r sm:border-zinc-200 sm:p-8 dark:sm:border-zinc-800'>
          <div className='mb-4 flex items-center justify-between gap-4'>
            <span className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              Exact source change
            </span>
            <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              Proposal #184
            </span>
          </div>
          <SourceDiff revealed={phase >= 1} />
        </div>

        <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:border-t-0 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/30'>
          <div className='mb-5 text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
            Evidence before production
          </div>
          <ReviewTimeline phase={phase} />
        </div>
      </div>

      <div className='flex items-end justify-between gap-6 border-t border-zinc-200 px-6 py-5 sm:px-8 dark:border-zinc-800'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            aria-live='polite'
          >
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              {current.title}
            </div>
            <div className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
              {current.detail}
            </div>
          </motion.div>
        </AnimatePresence>
        <span className='shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Open change review →
        </span>
      </div>
    </div>
  );
}

type ReviewView = 'change' | 'verification' | 'review';

function ChangeView() {
  return (
    <div className='grid md:grid-cols-[1.08fr_0.92fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Exact source change
        </div>
        <div className='mt-5'>
          <SourceDiff revealed />
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Visual impact
        </div>
        <div className='mt-6 space-y-3'>
          {[
            ['Deploy preview', 'completed'],
            ['Await approval', '2h timeout'],
            ['Promote', 'production'],
          ].map(([label, detail], index) => (
            <div key={label} className='relative flex items-center gap-3'>
              {index < 2 && (
                <span className='absolute top-5 left-[7px] h-5 w-px bg-zinc-200 dark:bg-zinc-700' />
              )}
              <span
                className={`relative h-3.5 w-3.5 rounded-full border ${
                  index === 1
                    ? 'border-[#D9A28D] bg-[#D9A28D]'
                    : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
                }`}
              />
              <div className='flex min-w-0 flex-1 items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950'>
                <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
                  {label}
                </span>
                <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className='mt-6 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
          The canvas explains the operational impact. The proposal preserves the exact TypeScript change developers review.
        </p>
      </div>
    </div>
  );
}

function VerificationView() {
  const [runKey, setRunKey] = useState(0);
  const [progress, setProgress] = useState(2);
  const reduceMotion = useReducedMotion();

  const rerun = useCallback(() => {
    setProgress(0);
    setRunKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (runKey === 0) return;
    if (reduceMotion) {
      setProgress(2);
      return;
    }

    const first = window.setTimeout(() => setProgress(1), 900);
    const second = window.setTimeout(() => setProgress(2), 1800);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [reduceMotion, runKey]);

  const cases = [
    {
      id: 'release_1042',
      detail: 'Approval received in 36m',
      result: 'Completed',
    },
    {
      id: 'release_1043',
      detail: 'No approval after 2h',
      result: 'Escalated',
    },
  ];

  return (
    <div className='grid md:grid-cols-[0.82fr_1.18fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Required checks
        </div>
        <div className='mt-5 space-y-3.5'>
          {CHECKS.map((check) => (
            <div key={check} className='flex items-center gap-3'>
              <StatusMark complete active={false} />
              <span className='text-xs text-zinc-900 dark:text-zinc-100'>{check}</span>
              <span className='ml-auto font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
                passed
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        <div className='flex items-start justify-between gap-5'>
          <div>
            <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              Isolated preview
            </div>
            <div className='mt-2 font-mono text-[10px] text-zinc-500 dark:text-zinc-400'>
              release-pr-184.flowcordia.dev
            </div>
          </div>
          <button
            type='button'
            onClick={rerun}
            className='rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
          >
            Run preview again
          </button>
        </div>

        <div className='mt-6 space-y-3'>
          {cases.map((testCase, index) => {
            const complete = progress > index;
            const active = progress === index;
            return (
              <div
                key={testCase.id}
                className='rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950'
              >
                <div className='flex items-center gap-3'>
                  <StatusMark complete={complete} active={active} />
                  <span className='font-mono text-[10px] text-zinc-700 dark:text-zinc-300'>
                    {testCase.id}
                  </span>
                  <span className='ml-auto text-[10px] text-zinc-400 dark:text-zinc-500'>
                    {complete ? testCase.result : active ? 'Running' : 'Waiting'}
                  </span>
                </div>
                <div className='mt-2 pl-7 text-xs text-zinc-500 dark:text-zinc-400'>
                  {testCase.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReviewViewPanel() {
  const evidence = [
    ['Source', 'workflow/release.workflow.ts'],
    ['Proposal', '#184 · 1 file changed'],
    ['Checks', '4 required checks passed'],
    ['Preview', '2 release paths verified'],
    ['Review', 'Approved by @platform-team'],
    ['Deployment', 'Production · 7f91b2d'],
  ];

  return (
    <div className='grid md:grid-cols-[1fr_1fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Review decision
        </div>
        <h3 className='mt-5 text-xl font-medium tracking-[-0.025em] text-zinc-950 dark:text-zinc-50'>
          Approved with the evidence attached.
        </h3>
        <p className='mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
          The visual intent, exact source diff, automated checks, preview runs, reviewer decision, and deployed commit stay connected as one change.
        </p>
        <div className='mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300'>
          <span className='h-1.5 w-1.5 rounded-full bg-[#D9A28D]' />
          Production updated safely
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Evidence chain
        </div>
        <dl className='mt-5 divide-y divide-zinc-200 dark:divide-zinc-800'>
          {evidence.map(([label, value]) => (
            <div key={label} className='grid grid-cols-[90px_1fr] gap-4 py-3 first:pt-0'>
              <dt className='text-[10px] text-zinc-400 dark:text-zinc-500'>{label}</dt>
              <dd className='text-xs text-zinc-800 dark:text-zinc-200'>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ChangeReview() {
  const [view, setView] = useState<ReviewView>('change');
  const views: { key: ReviewView; label: string }[] = [
    { key: 'change', label: 'Change' },
    { key: 'verification', label: 'Verification' },
    { key: 'review', label: 'Review' },
  ];

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 px-6 py-4 sm:px-8 dark:border-zinc-800'>
        <div className='flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900'>
          {views.map((item) => (
            <button
              key={item.key}
              type='button'
              onClick={() => setView(item.key)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none ${
                view === item.key
                  ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className='font-mono text-[10px] text-zinc-400 dark:text-zinc-500'>
          Proposal #184 · release workflow
        </span>
      </div>

      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          {view === 'change' && <ChangeView />}
          {view === 'verification' && <VerificationView />}
          {view === 'review' && <ReviewViewPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ReviewedDeliveryWorkflow() {
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
              02 · Review and deploy
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Ship workflow changes like software.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Every visual edit becomes an exact diff, a tested preview, and a reviewed Git change before production.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            Proposal #184
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
              Change review
            </div>
            <MorphingDialogTitle className='mt-3 max-w-2xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Nothing reaches production without leaving evidence.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Inspect the exact change, rerun its isolated preview, and follow the proposal to the deployed commit.
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
            <ChangeReview />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
