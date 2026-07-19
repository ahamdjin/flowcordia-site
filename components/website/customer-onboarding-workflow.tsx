'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const RUN_STEPS = [
  {
    label: 'Customer created',
    activity: 'A new customer enters the workflow.',
    explanation:
      'Flowcordia receives the customer.created event and starts the production workflow.',
    detailLabel: 'Event',
    detail: [
      'type: "customer.created"',
      'customerId: "cus_1042"',
      'plan: "growth"',
    ],
  },
  {
    label: 'Validate customer',
    activity: 'The payload is checked before anything runs.',
    explanation:
      'The visual workflow and its typed contract agree on the data required by the next step.',
    detailLabel: 'Contract',
    detail: [
      'contract: CustomerCreated',
      'required: customerId, plan',
      'result: valid',
    ],
  },
  {
    label: 'Configure workspace',
    activity: 'A typed function creates the workspace.',
    explanation:
      'Developers keep real TypeScript where it belongs, while the workflow remains visible to the whole team.',
    detailLabel: 'Typed function',
    detail: [
      'configureWorkspace({',
      '  customerId: "cus_1042",',
      '  plan: "growth"',
      '})',
    ],
  },
  {
    label: 'Workspace created',
    activity: 'The function returns a real business result.',
    explanation:
      'The returned workspace becomes the input for the next workflow step without losing execution context.',
    detailLabel: 'Output',
    detail: [
      'workspaceId: "ws_8821"',
      'status: "ready"',
      'region: "eu-west"',
    ],
  },
  {
    label: 'Welcome sent',
    activity: 'The customer receives the welcome message.',
    explanation:
      'The workflow completes with every step attached to the exact source version that produced it.',
    detailLabel: 'Delivery',
    detail: [
      'channel: "email"',
      'template: "welcome"',
      'status: "sent"',
    ],
  },
] as const;

const COMPLETED_RUN = {
  activity: 'Workspace ready.',
  explanation:
    'The customer is onboarded, the full execution is inspectable, and the run points back to commit a84f2c1.',
  detailLabel: 'Outcome',
  detail: [
    'workspace: "ws_8821"',
    'outcome: "ready"',
    'duration: "1.8s"',
    'version: "a84f2c1"',
  ],
};

function useExecutionSequence(play: boolean, loop: boolean) {
  const [progress, setProgress] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const reduceMotion = useReducedMotion();

  const replay = useCallback(() => {
    setProgress(0);
    setRunKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!play) return;

    if (reduceMotion) {
      setProgress(RUN_STEPS.length);
      return;
    }

    setProgress(0);

    const marks = [900, 1900, 3300, 4500, 5600];
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setProgress(index + 1), delay)
    );

    if (loop) {
      timers.push(
        window.setTimeout(
          () => setRunKey((current) => current + 1),
          7800
        )
      );
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [loop, play, reduceMotion, runKey]);

  return { progress, replay };
}

function TimelineDot({
  index,
  progress,
}: {
  index: number;
  progress: number;
}) {
  const isComplete = index < progress;
  const isActive = progress < RUN_STEPS.length && index === progress;

  return (
    <span className='relative flex h-4 w-4 items-center justify-center'>
      {isActive && (
        <motion.span
          aria-hidden='true'
          className='absolute h-4 w-4 rounded-full bg-[#D9A28D]/20'
          animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <motion.span
        aria-hidden='true'
        className={`relative h-2 w-2 rounded-full border transition-colors duration-300 ${
          isActive
            ? 'border-[#D9A28D] bg-[#D9A28D]'
            : isComplete
              ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
              : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
        }`}
        animate={{ scale: isActive ? 1.15 : 1 }}
      />
    </span>
  );
}

function ExecutionTimeline({ progress }: { progress: number }) {
  const completedLine =
    RUN_STEPS.length > 1
      ? (Math.min(progress, RUN_STEPS.length - 1) /
          (RUN_STEPS.length - 1)) *
        100
      : 0;

  return (
    <>
      <div className='relative hidden sm:block'>
        <div className='absolute top-2 right-[10%] left-[10%] h-px bg-zinc-200 dark:bg-zinc-800'>
          <motion.div
            className='h-full bg-zinc-900 dark:bg-zinc-100'
            animate={{ width: `${completedLine}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className='relative grid grid-cols-5 gap-3'>
          {RUN_STEPS.map((step, index) => {
            const isActive = progress < RUN_STEPS.length && index === progress;
            const isComplete = index < progress;

            return (
              <div key={step.label} className='min-w-0 text-center'>
                <div className='mx-auto flex h-4 w-4 items-center justify-center bg-white dark:bg-zinc-950'>
                  <TimelineDot index={index} progress={progress} />
                </div>
                <div
                  className={`mt-4 text-[11px] font-medium transition-colors duration-300 ${
                    isActive || isComplete
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='space-y-3 sm:hidden'>
        {RUN_STEPS.map((step, index) => {
          const isActive = progress < RUN_STEPS.length && index === progress;
          const isComplete = index < progress;

          return (
            <div key={step.label} className='flex items-center gap-3'>
              <TimelineDot index={index} progress={progress} />
              <span
                className={`text-xs transition-colors duration-300 ${
                  isActive || isComplete
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CurrentRunText({ progress }: { progress: number }) {
  const current =
    progress >= RUN_STEPS.length ? COMPLETED_RUN : RUN_STEPS[progress];

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={progress}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
        aria-live='polite'
      >
        <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
          {current.activity}
        </div>
        <div className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
          {progress >= RUN_STEPS.length
            ? 'Completed in 1.8s · exact version a84f2c1'
            : `Running step ${progress + 1} of ${RUN_STEPS.length}`}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function CustomerOnboardingPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.45 });
  const { progress } = useExecutionSequence(isInView, true);

  return (
    <div
      ref={sectionRef}
      className='flex min-h-0 flex-1 flex-col px-7 pt-10 pb-7 sm:px-10 sm:pt-12 sm:pb-9'
    >
      <ExecutionTimeline progress={progress} />

      <div className='mt-auto flex items-end justify-between gap-8 border-t border-zinc-200 pt-6 dark:border-zinc-800'>
        <CurrentRunText progress={progress} />
        <span className='shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Open run replay →
        </span>
      </div>
    </div>
  );
}

function RunDetail({ progress }: { progress: number }) {
  const current =
    progress >= RUN_STEPS.length ? COMPLETED_RUN : RUN_STEPS[progress];

  return (
    <div className='grid border-y border-zinc-200 dark:border-zinc-800 md:grid-cols-[1.08fr_0.92fr]'>
      <div className='min-h-[230px] p-7 sm:p-9 md:border-r md:border-zinc-200 dark:md:border-zinc-800'>
        <div className='text-[10px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
          What Flowcordia is doing
        </div>

        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={`story-${progress}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            <h3 className='mt-5 max-w-lg text-xl font-medium tracking-[-0.025em] text-zinc-950 dark:text-zinc-50 sm:text-2xl'>
              {current.activity}
            </h3>
            <p className='mt-4 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              {current.explanation}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='min-h-[230px] border-t border-zinc-200 bg-zinc-50 p-7 sm:p-9 md:border-t-0 dark:border-zinc-800 dark:bg-zinc-950'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={`detail-${progress}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className='text-[10px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              {current.detailLabel}
            </div>
            <code className='mt-5 block whitespace-pre-wrap font-mono text-xs leading-7 text-zinc-700 dark:text-zinc-300'>
              {current.detail.join('\n')}
            </code>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CustomerOnboardingDetails() {
  const { progress, replay } = useExecutionSequence(true, false);

  return (
    <div>
      <div className='px-7 pt-7 pb-8 sm:px-9 sm:pt-8 sm:pb-10'>
        <div className='mb-8 flex items-center justify-between gap-5'>
          <span className='font-mono text-[11px] text-zinc-400 dark:text-zinc-500'>
            Production · commit a84f2c1
          </span>
          <button
            type='button'
            onClick={replay}
            className='rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
          >
            Replay run
          </button>
        </div>
        <ExecutionTimeline progress={progress} />
      </div>

      <RunDetail progress={progress} />

      <div className='grid gap-4 px-7 py-5 text-xs text-zinc-500 sm:grid-cols-3 sm:px-9 dark:text-zinc-400'>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Source
          </span>
          <span className='mt-1.5 block font-mono'>acme/operations</span>
        </div>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Execution
          </span>
          <span className='mt-1.5 block'>Production · 1.8s</span>
        </div>
        <div>
          <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-600'>
            Outcome
          </span>
          <span className='mt-1.5 block'>Workspace ready</span>
        </div>
      </div>
    </div>
  );
}
