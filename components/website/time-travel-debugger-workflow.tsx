'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

const TRACE = [
  {
    label: 'Trigger',
    time: '09:41:02',
    title: 'Pull request merged',
    detail: 'Release workflow started from the reviewed commit.',
    source: 'trigger: pullRequest.merged,',
    output: 'pr_184',
    status: 'completed',
  },
  {
    label: 'Build',
    time: '09:41:05',
    title: 'Build completed',
    detail: 'The release artifact was produced once and checkpointed.',
    source: 'await build(release);',
    output: 'build_1842',
    status: 'completed',
  },
  {
    label: 'Test',
    time: '09:41:18',
    title: 'Tests completed',
    detail: 'The exact artifact passed the reviewed test contract.',
    source: 'await test(build);',
    output: '42 passed',
    status: 'completed',
  },
  {
    label: 'Approval',
    time: '09:42:11',
    title: 'Release approved',
    detail: 'The approval result was preserved before production began.',
    source: 'await approval.wait({ timeout: "2h" });',
    output: 'approved',
    status: 'completed',
  },
  {
    label: 'Deploy',
    time: '09:42:14',
    title: 'Production deploy failed',
    detail: 'The provider returned a temporary 503 response on attempt 1.',
    source: 'await deployProduction(release);',
    output: '503 Service unavailable',
    status: 'failed',
  },
  {
    label: 'Retry',
    time: '09:42:17',
    title: 'Failed step resumed',
    detail: 'Flowcordia restored the checkpoint and retried only production.',
    source: 'retry: { attempts: 3, backoff: "exponential" },',
    output: 'attempt 2',
    status: 'retrying',
  },
  {
    label: 'Complete',
    time: '09:42:26',
    title: 'Release completed',
    detail: 'The same run finished without rebuilding or repeating approval.',
    source: 'return deployment.completed;',
    output: 'dep_7291',
    status: 'completed',
  },
] as const;

const CHECKPOINT = [
  ['buildId', 'build_1842'],
  ['approval', 'approved'],
  ['region', 'iad1'],
  ['commit', '7f91b2d'],
] as const;

const CLOSED_PHASES = [
  { event: 0, mode: 'trace', title: 'Run started', detail: 'commit 7f91b2d' },
  { event: 1, mode: 'trace', title: 'Build checkpointed', detail: 'build_1842' },
  { event: 2, mode: 'trace', title: 'Tests passed', detail: '42 checks' },
  { event: 3, mode: 'trace', title: 'Approval preserved', detail: 'approved' },
  { event: 4, mode: 'failure', title: 'Production deploy failed', detail: '503 · attempt 1' },
  { event: 4, mode: 'state', title: 'Checkpoint restored', detail: 'completed work preserved' },
  { event: 4, mode: 'source', title: 'Exact source revealed', detail: 'release.workflow.ts' },
  { event: 6, mode: 'recovered', title: 'Recovered without restarting', detail: 'run_8fd2 · 2 attempts' },
] as const;

type TraceStatus = (typeof TRACE)[number]['status'];
type ClosedMode = (typeof CLOSED_PHASES)[number]['mode'];

function useClosedSequence(play: boolean) {
  const [phase, setPhase] = useState(0);
  const [sequenceKey, setSequenceKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!play) return;

    if (reduceMotion) {
      setPhase(CLOSED_PHASES.length - 1);
      return;
    }

    setPhase(0);
    const marks = [700, 1400, 2100, 2850, 3900, 5000, 6200];
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );

    timers.push(
      window.setTimeout(
        () => setSequenceKey((current) => current + 1),
        9000
      )
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [play, reduceMotion, sequenceKey]);

  return phase;
}

function TraceDot({
  status,
  active,
  complete,
}: {
  status: TraceStatus;
  active: boolean;
  complete: boolean;
}) {
  const failed = status === 'failed' && active;
  const retrying = status === 'retrying' && active;

  return (
    <span className='relative flex h-5 w-5 items-center justify-center'>
      {active && (
        <motion.span
          aria-hidden='true'
          className={`absolute h-5 w-5 rounded-full ${
            failed ? 'bg-red-400/20' : 'bg-[#D9A28D]/25'
          }`}
          animate={{ scale: [0.75, 1.45, 0.75], opacity: [0.8, 0.15, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span
        aria-hidden='true'
        className={`relative h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
          failed
            ? 'border-red-400 bg-red-400'
            : retrying
              ? 'border-[#D9A28D] bg-[#D9A28D]'
              : complete || active
                ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
        }`}
      />
    </span>
  );
}

function TraceRail({
  activeIndex,
  mode = 'trace',
  interactive = false,
  onSelect,
}: {
  activeIndex: number;
  mode?: ClosedMode | 'debug';
  interactive?: boolean;
  onSelect?: (index: number) => void;
}) {
  const progress = (activeIndex / (TRACE.length - 1)) * 100;
  const subdued = mode === 'state' || mode === 'source';

  return (
    <motion.div
      className='relative mx-auto w-full max-w-[760px] px-5 sm:px-10'
      animate={{ opacity: subdued ? 0.2 : 1, scale: subdued ? 0.96 : 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className='absolute top-2.5 right-8 left-8 h-px bg-zinc-200 sm:right-14 sm:left-14 dark:bg-zinc-800' />
      <motion.div
        className='absolute top-2.5 left-8 h-px bg-zinc-900 sm:left-14 dark:bg-zinc-100'
        animate={{ width: `calc((100% - ${interactive ? '112px' : '112px'}) * ${progress / 100})` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <div className='relative grid grid-cols-7'>
        {TRACE.map((event, index) => {
          const active = index === activeIndex;
          const complete = index <= activeIndex;
          const content = (
            <>
              <TraceDot status={event.status} active={active} complete={complete} />
              <span
                className={`mt-3 hidden text-[9px] font-medium tracking-[0.04em] uppercase transition-colors sm:block ${
                  active
                    ? 'text-zinc-950 dark:text-zinc-50'
                    : complete
                      ? 'text-zinc-600 dark:text-zinc-300'
                      : 'text-zinc-400 dark:text-zinc-600'
                }`}
              >
                {event.label}
              </span>
            </>
          );

          return interactive ? (
            <button
              key={event.label}
              type='button'
              onClick={() => onSelect?.(index)}
              className='flex min-w-0 flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60'
              aria-label={`Inspect ${event.label} at ${event.time}`}
              aria-pressed={active}
            >
              {content}
            </button>
          ) : (
            <div key={event.label} className='flex min-w-0 flex-col items-center'>
              {content}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function FailureFocus() {
  return (
    <motion.div
      key='failure'
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.04, y: -8 }}
      className='absolute inset-x-6 top-1/2 mx-auto max-w-md -translate-y-1/2 text-center'
    >
      <div className='font-mono text-[10px] tracking-[0.08em] text-red-400 uppercase'>
        Deploy · attempt 1
      </div>
      <div className='mt-4 text-2xl font-medium tracking-[-0.035em] text-zinc-950 sm:text-3xl dark:text-zinc-50'>
        503 Service unavailable
      </div>
      <div className='mt-3 text-sm text-zinc-500 dark:text-zinc-400'>
        The run pauses here. Everything before it stays complete.
      </div>
    </motion.div>
  );
}

function CheckpointFocus() {
  return (
    <motion.div
      key='state'
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      className='absolute inset-x-6 top-1/2 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_24px_80px_rgba(9,9,11,0.12)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95'
    >
      <div className='flex items-center justify-between font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
        <span>checkpoint_04</span>
        <span>preserved</span>
      </div>
      <div className='mt-4 space-y-2 font-mono text-[11px]'>
        {CHECKPOINT.map(([key, value]) => (
          <div key={key} className='flex items-center justify-between gap-6'>
            <span className='text-zinc-500 dark:text-zinc-400'>{key}</span>
            <span className='text-zinc-900 dark:text-zinc-100'>{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SourceFocus() {
  return (
    <motion.div
      key='source'
      initial={{ opacity: 0, x: 32, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -32, scale: 1.02 }}
      className='absolute inset-x-6 top-1/2 mx-auto max-w-lg -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-left shadow-[0_24px_80px_rgba(9,9,11,0.24)]'
    >
      <div className='flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[9px] text-zinc-500'>
        <span>release.workflow.ts</span>
        <span>commit 7f91b2d</span>
      </div>
      <div className='px-5 py-5 font-mono text-[10px] leading-7 sm:text-[11px]'>
        <div className='text-zinc-500'>await deployProduction({'{'}</div>
        <div className='pl-5 text-zinc-300'>release,</div>
        <div className='rounded bg-[#D9A28D]/10 px-2 pl-5 text-[#E8B8A5]'>
          retry: {'{'} attempts: 3, backoff: &quot;exponential&quot; {'}'},
        </div>
        <div className='text-zinc-500'>{'}'});</div>
      </div>
    </motion.div>
  );
}

function ClosedPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { amount: 0.45 });
  const phase = useClosedSequence(inView);
  const current = CLOSED_PHASES[phase];

  return (
    <div ref={previewRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='relative min-h-0 flex-1 overflow-hidden border-t border-zinc-200 dark:border-zinc-800'>
        <div className='absolute inset-x-0 top-8 z-10 flex items-center justify-between px-6 font-mono text-[9px] text-zinc-400 sm:px-10 dark:text-zinc-500'>
          <span>run_8fd2</span>
          <span>09:41:02 → 09:42:26</span>
        </div>

        <div className='absolute inset-x-0 top-[42%] -translate-y-1/2'>
          <TraceRail activeIndex={current.event} mode={current.mode} />
        </div>

        <AnimatePresence mode='wait'>
          {current.mode === 'failure' && <FailureFocus />}
          {current.mode === 'state' && <CheckpointFocus />}
          {current.mode === 'source' && <SourceFocus />}
          {current.mode === 'recovered' && (
            <motion.div
              key='recovered'
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className='absolute inset-x-6 bottom-10 mx-auto max-w-md text-center'
            >
              <div className='text-lg font-medium tracking-[-0.025em] text-zinc-950 dark:text-zinc-50'>
                Same run. No repeated work.
              </div>
              <div className='mt-2 font-mono text-[10px] text-zinc-400 dark:text-zinc-500'>
                build and approval remained checkpointed
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          Scrub the run →
        </span>
      </div>
    </div>
  );
}

function EventDetail({ index }: { index: number }) {
  const event = TRACE[index];
  const failed = event.status === 'failed';
  const retry = event.status === 'retrying';

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={event.label}
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
        transition={{ duration: 0.24 }}
        className='relative z-10 mx-auto w-full max-w-lg text-center'
      >
        <div
          className={`font-mono text-[10px] tracking-[0.08em] uppercase ${
            failed
              ? 'text-red-400'
              : retry
                ? 'text-[#C98F79] dark:text-[#E8B8A5]'
                : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {event.time} · {event.label}
        </div>
        <div className='mt-4 text-2xl font-medium tracking-[-0.035em] text-zinc-950 sm:text-3xl dark:text-zinc-50'>
          {event.title}
        </div>
        <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
          {event.detail}
        </p>

        <div className='mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 font-mono text-[10px] text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'>
          <span className={`h-1.5 w-1.5 rounded-full ${failed ? 'bg-red-400' : 'bg-[#D9A28D]'}`} />
          {event.output}
        </div>

        {(failed || retry || index === TRACE.length - 1) && (
          <div className='mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2 text-left font-mono text-[9px]'>
            <div className='rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3'>
              <div className='text-red-400'>attempt 1</div>
              <div className='mt-1 text-zinc-500 dark:text-zinc-400'>503 failed</div>
            </div>
            <div className='rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950'>
              <div className='text-zinc-900 dark:text-zinc-100'>attempt 2</div>
              <div className='mt-1 text-zinc-500 dark:text-zinc-400'>
                {failed ? 'not started' : retry ? 'running' : 'completed'}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function GhostState({ index }: { index: number }) {
  const visible = index >= 3;

  return (
    <motion.div
      aria-hidden='true'
      className='pointer-events-none absolute top-8 left-6 hidden w-44 rounded-xl border border-zinc-200 bg-white/70 p-4 font-mono text-[9px] backdrop-blur md:block dark:border-zinc-800 dark:bg-zinc-950/70'
      animate={{ opacity: visible ? 0.55 : 0, x: visible ? 0 : -18 }}
    >
      <div className='text-zinc-400 dark:text-zinc-500'>preserved state</div>
      <div className='mt-3 space-y-1.5 text-zinc-600 dark:text-zinc-300'>
        <div>build: build_1842</div>
        <div>approval: approved</div>
        <div>commit: 7f91b2d</div>
      </div>
    </motion.div>
  );
}

function SourceLayer({ index }: { index: number }) {
  const event = TRACE[index];

  return (
    <motion.div
      className='pointer-events-none absolute top-8 right-6 hidden w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-left shadow-xl md:block'
      initial={false}
      animate={{ opacity: index >= 4 ? 0.9 : 0.28, x: index >= 4 ? 0 : 16 }}
    >
      <div className='border-b border-white/10 px-4 py-2.5 font-mono text-[8px] text-zinc-500'>
        release.workflow.ts
      </div>
      <div className='px-4 py-4 font-mono text-[9px] leading-6 text-zinc-300'>
        <div className='text-zinc-600'>// selected source</div>
        <motion.div
          key={event.source}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className='mt-1 rounded bg-[#D9A28D]/10 px-2 text-[#E8B8A5]'
        >
          {event.source}
        </motion.div>
      </div>
    </motion.div>
  );
}

function RunDebugger() {
  const [index, setIndex] = useState(4);
  const progress = useMemo(
    () => (index / (TRACE.length - 1)) * 100,
    [index]
  );

  return (
    <div className='border-t border-zinc-200 dark:border-zinc-800'>
      <div className='relative min-h-[500px] overflow-hidden bg-zinc-50/60 px-6 py-10 sm:px-10 dark:bg-zinc-900/20'>
        <GhostState index={index} />
        <SourceLayer index={index} />

        <div className='relative z-10 mx-auto max-w-[760px]'>
          <TraceRail
            activeIndex={index}
            mode='debug'
            interactive
            onSelect={setIndex}
          />
        </div>

        <div className='relative flex min-h-[350px] items-center pt-12'>
          <EventDetail index={index} />
        </div>
      </div>

      <div className='border-t border-zinc-200 bg-white px-6 py-6 sm:px-10 dark:border-zinc-800 dark:bg-zinc-950'>
        <div className='mb-4 flex items-center justify-between font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
          <span>{TRACE[index].time}</span>
          <span>{Math.round(progress)}% through run</span>
        </div>
        <input
          type='range'
          min='0'
          max={TRACE.length - 1}
          step='1'
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
          className='w-full accent-zinc-900 dark:accent-zinc-100'
          aria-label='Scrub through workflow run'
        />
        <div className='mt-4 grid grid-cols-7 gap-1 font-mono text-[8px] text-zinc-400 dark:text-zinc-600'>
          {TRACE.map((event, eventIndex) => (
            <button
              key={event.time}
              type='button'
              onClick={() => setIndex(eventIndex)}
              className={`truncate text-center transition-colors ${
                eventIndex === index
                  ? 'text-zinc-950 dark:text-zinc-50'
                  : 'hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {event.time.slice(3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimeTravelDebuggerWorkflow() {
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
              05 · Debug and replay
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Trace every outcome back to source.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Move through a run moment by moment—from failure, to preserved state, to the exact reviewed line that governed it.
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
          className='pointer-events-auto relative flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[1040px] flex-col overflow-y-auto border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-950'
        >
          <div className='px-7 pt-7 pb-6 pr-16 sm:px-9 sm:pt-9 sm:pb-8'>
            <div className='text-[10px] font-medium tracking-[0.09em] text-zinc-400 uppercase dark:text-zinc-500'>
              Time-travel debugger
            </div>
            <MorphingDialogTitle className='mt-3 max-w-2xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Every run is replayable evidence.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Scrub the execution timeline. The canvas, checkpoint, attempts, output, and matching source line all return to the same moment.
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
            <RunDebugger />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
