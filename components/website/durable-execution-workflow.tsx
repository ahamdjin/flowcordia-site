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

const RUN_STEPS = [
  { key: 'build', label: 'Build', threshold: 1 },
  { key: 'test', label: 'Test', threshold: 2 },
  { key: 'preview', label: 'Deploy preview', threshold: 3 },
  { key: 'approval', label: 'Await approval', threshold: 4 },
  { key: 'production', label: 'Production deploy', threshold: 9 },
] as const;

type StepKey = (typeof RUN_STEPS)[number]['key'];

type SequencePhase = {
  title: string;
  detail: string;
};

const SEQUENCE: SequencePhase[] = [
  { title: 'Production run started', detail: 'run_8fd2 · commit 7f91b2d' },
  { title: 'Build completed', detail: 'build_1842 · 42s' },
  { title: 'Tests completed', detail: '128 checks passed' },
  { title: 'Preview deployed', detail: 'release-184.preview.dev' },
  { title: 'Approval received', detail: 'Approved by Maya Chen' },
  { title: 'Production deploy running', detail: 'Attempt 1 of 3' },
  { title: 'Provider returned an error', detail: '503 Service unavailable' },
  { title: 'Progress preserved', detail: 'Retrying only production deploy in 3s' },
  { title: 'Production deploy resumed', detail: 'Attempt 2 of 3' },
  { title: 'Recovered without restarting', detail: 'Run completed · 2 attempts' },
];

const STEP_DETAILS: Record<
  StepKey,
  {
    description: string;
    input: string[];
    output: string[];
    duration: string;
    source: string;
  }
> = {
  build: {
    description: 'Build the reviewed release source once for this exact workflow version.',
    input: ['commit: "7f91b2d"', 'workflow: "release"'],
    output: ['buildId: "build_1842"', 'status: "ready"'],
    duration: '42s',
    source: 'await buildRelease({ commit })',
  },
  test: {
    description: 'Run the release contract and generated-function checks against the finished build.',
    input: ['buildId: "build_1842"', 'suite: "release"'],
    output: ['checks: 128', 'failed: 0'],
    duration: '18s',
    source: 'await testRelease({ buildId })',
  },
  preview: {
    description: 'Create the isolated deployment used by the proposal review.',
    input: ['buildId: "build_1842"', 'environment: "preview"'],
    output: ['previewId: "prv_184"', 'status: "ready"'],
    duration: '31s',
    source: 'await deployPreview({ buildId })',
  },
  approval: {
    description: 'Wait durably for the reviewer decision without occupying a running process.',
    input: ['proposal: 184', 'timeout: "2h"'],
    output: ['decision: "approved"', 'reviewer: "maya"'],
    duration: '36m',
    source: 'await awaitApproval({ timeout: "2h" })',
  },
  production: {
    description: 'Resume the failed deployment from the preserved checkpoint instead of replaying completed work.',
    input: ['buildId: "build_1842"', 'approval: "approved"'],
    output: ['deploymentId: "dep_7291"', 'status: "completed"'],
    duration: '54s',
    source: 'await deployProduction({ release, retry })',
  },
};

function useRunSequence(play: boolean) {
  const [phase, setPhase] = useState(0);
  const [sequenceKey, setSequenceKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!play) return;

    if (reduceMotion) {
      setPhase(SEQUENCE.length - 1);
      return;
    }

    setPhase(0);
    const marks = [700, 1400, 2100, 2850, 3600, 4500, 5400, 6600, 7600];
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );

    timers.push(
      window.setTimeout(
        () => setSequenceKey((current) => current + 1),
        10000
      )
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [play, reduceMotion, sequenceKey]);

  return phase;
}

function StatusDot({
  state,
}: {
  state: 'waiting' | 'active' | 'complete' | 'error';
}) {
  return (
    <span className='relative flex h-4 w-4 shrink-0 items-center justify-center'>
      {state === 'active' && (
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
          state === 'active'
            ? 'border-[#D9A28D] bg-[#D9A28D]'
            : state === 'complete'
              ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
              : state === 'error'
                ? 'border-red-400 bg-red-400'
                : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
        }`}
      />
    </span>
  );
}

function stepState(step: (typeof RUN_STEPS)[number], phase: number) {
  if (step.key !== 'production') {
    if (phase >= step.threshold) return 'complete' as const;
    if (phase === step.threshold - 1) return 'active' as const;
    return 'waiting' as const;
  }

  if (phase >= 9) return 'complete' as const;
  if (phase === 6) return 'error' as const;
  if (phase >= 4) return 'active' as const;
  return 'waiting' as const;
}

function productionDetail(phase: number) {
  if (phase < 5) return 'waiting';
  if (phase === 5) return 'attempt 1';
  if (phase === 6) return '503 error';
  if (phase === 7) return 'retry in 3s';
  if (phase === 8) return 'attempt 2';
  return 'completed';
}

function ExecutionSteps({ phase }: { phase: number }) {
  return (
    <div className='space-y-3.5'>
      {RUN_STEPS.map((step, index) => {
        const state = stepState(step, phase);
        const detail =
          step.key === 'production'
            ? productionDetail(phase)
            : state === 'complete'
              ? 'completed once'
              : state === 'active'
                ? 'running'
                : 'waiting';

        return (
          <div key={step.key} className='relative flex items-center gap-3'>
            {index < RUN_STEPS.length - 1 && (
              <span className='absolute top-4 left-[7px] h-[18px] w-px bg-zinc-200 dark:bg-zinc-800' />
            )}
            <StatusDot state={state} />
            <span
              className={`text-xs transition-colors duration-300 ${
                state === 'waiting'
                  ? 'text-zinc-400 dark:text-zinc-600'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {step.label}
            </span>
            <span className='ml-auto font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              {detail}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AttemptLog({ phase }: { phase: number }) {
  const firstVisible = phase >= 5;
  const firstFailed = phase >= 6;
  const retryVisible = phase >= 7;
  const secondVisible = phase >= 8;
  const secondComplete = phase >= 9;

  return (
    <div className='space-y-3'>
      <div
        className={`rounded-xl border px-4 py-3 transition-colors ${
          firstFailed
            ? 'border-red-400/30 bg-red-400/5'
            : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
        }`}
      >
        <div className='flex items-center justify-between gap-4'>
          <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
            Attempt 1
          </span>
          <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
            {firstFailed ? 'failed' : firstVisible ? 'running' : 'waiting'}
          </span>
        </div>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={firstFailed ? 'failed' : firstVisible ? 'running' : 'waiting'}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className={`mt-2 font-mono text-[10px] ${
              firstFailed
                ? 'text-red-400'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {firstFailed
              ? '503 Service unavailable'
              : firstVisible
                ? 'deploying dep_7291'
                : 'not started'}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ opacity: retryVisible ? 1 : 0.25 }}
        className='flex items-center gap-3 px-1 text-[10px] text-zinc-400 dark:text-zinc-500'
      >
        <span className='h-px flex-1 bg-zinc-200 dark:bg-zinc-800' />
        <span>checkpoint preserved · retry production only</span>
        <span className='h-px flex-1 bg-zinc-200 dark:bg-zinc-800' />
      </motion.div>

      <div className='rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950'>
        <div className='flex items-center justify-between gap-4'>
          <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
            Attempt 2
          </span>
          <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
            {secondComplete ? 'completed' : secondVisible ? 'running' : 'waiting'}
          </span>
        </div>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={secondComplete ? 'complete' : secondVisible ? 'running' : 'waiting'}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className='mt-2 font-mono text-[10px] text-zinc-500 dark:text-zinc-400'
          >
            {secondComplete
              ? 'deployment completed'
              : secondVisible
                ? 'resuming dep_7291'
                : 'waiting for retry'}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClosedPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { amount: 0.45 });
  const phase = useRunSequence(inView);
  const current = SEQUENCE[phase];

  return (
    <div ref={previewRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='grid min-h-0 flex-1 border-t border-zinc-200 dark:border-zinc-800 sm:grid-cols-[0.86fr_1.14fr]'>
        <div className='p-6 sm:border-r sm:border-zinc-200 sm:p-8 dark:sm:border-zinc-800'>
          <div className='mb-5 flex items-center justify-between gap-4'>
            <span className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              Production run
            </span>
            <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              run_8fd2
            </span>
          </div>
          <ExecutionSteps phase={phase} />
        </div>

        <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:border-t-0 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/30'>
          <div className='mb-5 flex items-center justify-between gap-4'>
            <span className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              Production deploy
            </span>
            <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              {phase < 5
                ? '3 attempts max'
                : phase < 8
                  ? 'attempt 1 / 3'
                  : 'attempt 2 / 3'}
            </span>
          </div>
          <AttemptLog phase={phase} />
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
          Open run inspector →
        </span>
      </div>
    </div>
  );
}

type InspectorView = 'timeline' | 'state' | 'source';

function ReplayAttempts() {
  const [phase, setPhase] = useState(3);
  const [runKey, setRunKey] = useState(0);
  const reduceMotion = useReducedMotion();

  const replay = useCallback(() => {
    setPhase(0);
    setRunKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (runKey === 0) return;
    if (reduceMotion) {
      setPhase(3);
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 850),
      window.setTimeout(() => setPhase(2), 1800),
      window.setTimeout(() => setPhase(3), 2900),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduceMotion, runKey]);

  return (
    <div>
      <div className='flex items-center justify-between gap-5'>
        <div>
          <div className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            Production deploy
          </div>
          <div className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
            Completed steps remain checkpointed while this step replays.
          </div>
        </div>
        <button
          type='button'
          onClick={replay}
          className='shrink-0 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
        >
          Replay failed step
        </button>
      </div>

      <div className='mt-6 space-y-3'>
        <div className='rounded-xl border border-red-400/30 bg-red-400/5 p-4'>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
              Attempt 1
            </span>
            <span className='font-mono text-[9px] text-red-400'>failed</span>
          </div>
          <div className='mt-2 font-mono text-[10px] text-red-400'>
            503 Service unavailable
          </div>
        </div>

        <div className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950'>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
              Attempt 2
            </span>
            <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              {phase === 0
                ? 'waiting'
                : phase === 1
                  ? 'resuming'
                  : phase === 2
                    ? 'deploying'
                    : 'completed'}
            </span>
          </div>
          <motion.div
            key={`${runKey}-${phase}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-2 font-mono text-[10px] text-zinc-500 dark:text-zinc-400'
          >
            {phase === 0
              ? 'retry scheduled in 3s'
              : phase === 1
                ? 'checkpoint loaded'
                : phase === 2
                  ? 'resuming dep_7291'
                  : 'deployment completed'}
          </motion.div>
        </div>
      </div>

      <div className='mt-5 grid grid-cols-2 gap-3 text-[10px] sm:grid-cols-4'>
        {['Build', 'Test', 'Preview', 'Approval'].map((label) => (
          <div
            key={label}
            className='rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400'
          >
            <span className='block'>{label}</span>
            <span className='mt-0.5 block font-mono text-[9px]'>preserved</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineView() {
  const [selected, setSelected] = useState<StepKey>('production');
  const detail = STEP_DETAILS[selected];

  return (
    <div className='grid md:grid-cols-[0.72fr_1.28fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Completed run
        </div>
        <div className='mt-5 space-y-2'>
          {RUN_STEPS.map((step) => (
            <button
              key={step.key}
              type='button'
              onClick={() => setSelected(step.key)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#D9A28D] focus-visible:outline-none ${
                selected === step.key
                  ? 'border-[#D9A28D]/60 bg-[#D9A28D]/5'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
              }`}
            >
              <StatusDot state='complete' />
              <span className='text-xs font-medium text-zinc-900 dark:text-zinc-100'>
                {step.label}
              </span>
              <span className='ml-auto font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
                {STEP_DETAILS[step.key].duration}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        {selected === 'production' ? (
          <ReplayAttempts />
        ) : (
          <div>
            <div className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
              {RUN_STEPS.find((step) => step.key === selected)?.label}
            </div>
            <p className='mt-2 max-w-xl text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
              {detail.description}
            </p>
            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950'>
                <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
                  Input
                </div>
                <code className='mt-3 block whitespace-pre-wrap font-mono text-[10px] leading-6 text-zinc-600 dark:text-zinc-400'>
                  {detail.input.join('\n')}
                </code>
              </div>
              <div className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950'>
                <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
                  Output
                </div>
                <code className='mt-3 block whitespace-pre-wrap font-mono text-[10px] leading-6 text-zinc-600 dark:text-zinc-400'>
                  {detail.output.join('\n')}
                </code>
              </div>
            </div>
            <div className='mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'>
              {detail.source}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StateView() {
  return (
    <div className='grid md:grid-cols-[1fr_0.88fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Preserved checkpoint
        </div>
        <div className='mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800'>
          <div className='border-b border-white/10 px-4 py-3 font-mono text-[9px] text-zinc-500'>
            run_8fd2 · before production retry
          </div>
          <code className='block whitespace-pre-wrap px-5 py-5 font-mono text-[11px] leading-7 text-zinc-300'>{`{
  "buildId": "build_1842",
  "previewUrl": "release-184.preview.dev",
  "approval": "approved",
  "deploymentId": "dep_7291",
  "workflowVersion": "7f91b2d"
}`}</code>
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Why the run can resume
        </div>
        <h3 className='mt-5 text-xl font-medium tracking-[-0.025em] text-zinc-950 dark:text-zinc-50'>
          Completed work becomes durable state.
        </h3>
        <p className='mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
          The finished build, tested preview, reviewer decision, and deployment identity remain attached to the run. A temporary provider failure does not erase them or restart the workflow.
        </p>
        <div className='mt-6 border-t border-zinc-200 pt-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
          Exact version <code className='font-mono'>7f91b2d</code> remains pinned for every resumed attempt.
        </div>
      </div>
    </div>
  );
}

function SourceView() {
  return (
    <div className='grid md:grid-cols-[1.12fr_0.88fr]'>
      <div className='p-6 sm:p-8 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Exact source
        </div>
        <div className='mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800'>
          <div className='border-b border-white/10 px-4 py-3 font-mono text-[9px] text-zinc-500'>
            workflow/release.workflow.ts · 7f91b2d
          </div>
          <code className='block whitespace-pre-wrap px-5 py-5 font-mono text-[11px] leading-7 text-zinc-300'>{`await deployProduction({
  release,
  retry: {
    attempts: 3,
    backoff: "exponential",
  },
});`}</code>
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-zinc-50 p-6 sm:p-8 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-900/30'>
        <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          Runtime contract
        </div>
        <div className='mt-5 space-y-4'>
          {[
            ['Attempts', '3 maximum'],
            ['Backoff', 'Exponential'],
            ['Resume point', 'Production deploy'],
            ['Workflow version', '7f91b2d'],
          ].map(([label, value]) => (
            <div
              key={label}
              className='flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 text-xs last:border-b-0 dark:border-zinc-800'
            >
              <span className='text-zinc-500 dark:text-zinc-400'>{label}</span>
              <span className='font-mono text-[10px] text-zinc-900 dark:text-zinc-100'>
                {value}
              </span>
            </div>
          ))}
        </div>
        <p className='mt-6 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
          The retry policy is not hidden infrastructure configuration. It is part of the reviewed workflow source that produced this run.
        </p>
      </div>
    </div>
  );
}

function RunInspector() {
  const [view, setView] = useState<InspectorView>('timeline');

  return (
    <div>
      <div className='flex gap-1 border-y border-zinc-200 px-6 py-3 sm:px-8 dark:border-zinc-800'>
        {(['timeline', 'state', 'source'] as const).map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => setView(item)}
            className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none ${
              view === item
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
            }`}
          >
            {item}
          </button>
        ))}
        <span className='ml-auto hidden items-center font-mono text-[10px] text-zinc-400 sm:flex dark:text-zinc-500'>
          run_8fd2 · commit 7f91b2d
        </span>
      </div>

      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'timeline' && <TimelineView />}
          {view === 'state' && <StateView />}
          {view === 'source' && <SourceView />}
        </motion.div>
      </AnimatePresence>

      <div className='grid gap-4 border-t border-zinc-200 px-6 py-5 text-xs text-zinc-500 sm:grid-cols-3 sm:px-8 dark:border-zinc-800 dark:text-zinc-400'>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Result
          </span>
          <span className='mt-1.5 block'>Recovered · successful</span>
        </div>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Attempts
          </span>
          <span className='mt-1.5 block'>Production 2 · others 1</span>
        </div>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Evidence
          </span>
          <span className='mt-1.5 block font-mono'>run_8fd2 · 7f91b2d</span>
        </div>
      </div>
    </div>
  );
}

export function DurableExecutionWorkflow() {
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
              03 · Durable execution
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Workflows keep running when systems fail.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Every run pins the reviewed version, preserves completed work, and resumes only the step that failed.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            run_8fd2
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
              Run inspector
            </div>
            <MorphingDialogTitle className='mt-3 max-w-2xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Failure is part of the run—not the end of it.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Inspect the preserved checkpoint, replay only the failed production step, and trace the completed run to its exact source.
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
            <RunInspector />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
