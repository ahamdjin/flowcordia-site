'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const WORKFLOW_STEPS = [
  {
    key: 'trigger',
    kind: 'Trigger',
    label: 'Pull request merged',
    code: 'trigger: pullRequest.merged,',
    revealAt: 1,
    description: 'Starts the release workflow when a pull request reaches the main branch.',
  },
  {
    key: 'build',
    kind: 'Step',
    label: 'Build',
    code: 'build(),',
    revealAt: 3,
    description: 'Compiles the application from the exact workflow version under review.',
  },
  {
    key: 'test',
    kind: 'Step',
    label: 'Test',
    code: 'test(),',
    revealAt: 4,
    description: 'Runs the release test suite before a preview can be created.',
  },
  {
    key: 'preview',
    kind: 'Step',
    label: 'Deploy preview',
    code: 'deployPreview(),',
    revealAt: 5,
    description: 'Creates an isolated preview from the same proposed workflow version.',
  },
  {
    key: 'approval',
    kind: 'Gate',
    label: 'Await approval',
    code: 'awaitApproval({ timeout: "24h" }),',
    revealAt: 6,
    description: 'Pauses promotion until an authorized reviewer approves the release.',
  },
  {
    key: 'production',
    kind: 'Step',
    label: 'Production',
    code: 'promote(),',
    revealAt: 7,
    description: 'Promotes the reviewed preview to production without changing workflow identity.',
  },
] as const;

type StepKey = (typeof WORKFLOW_STEPS)[number]['key'];
type TimeoutValue = '24h' | '2h';

const SOURCE_LINES = [
  { number: 1, text: 'export const release = workflow({', revealAt: 0 },
  { number: 2, step: 'trigger' as StepKey, revealAt: 1 },
  { number: 3, text: '', revealAt: 2 },
  { number: 4, text: '  steps: [', revealAt: 2 },
  { number: 5, step: 'build' as StepKey, revealAt: 3 },
  { number: 6, step: 'test' as StepKey, revealAt: 4 },
  { number: 7, step: 'preview' as StepKey, revealAt: 5 },
  { number: 8, step: 'approval' as StepKey, revealAt: 6 },
  { number: 9, step: 'production' as StepKey, revealAt: 7 },
  { number: 10, text: '  ],', revealAt: 7 },
  { number: 11, text: '});', revealAt: 7 },
] as const;

const STAGE_DELAYS = [700, 1400, 2050, 2850, 3650, 4450, 5350, 6250, 7600, 9000];

function sourceForStep(step: StepKey, timeout: TimeoutValue = '24h') {
  const match = WORKFLOW_STEPS.find((item) => item.key === step);
  if (!match) return '';

  const code =
    step === 'approval'
      ? `awaitApproval({ timeout: "${timeout}" }),`
      : match.code;

  return step === 'trigger' ? `  ${code}` : `    ${code}`;
}

function useBuildSequence(play: boolean, loop: boolean) {
  const [stage, setStage] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const reducedMotion = useReducedMotion();

  const replay = useCallback(() => {
    setStage(0);
    setRunKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!play) return;

    if (reducedMotion) {
      setStage(10);
      return;
    }

    setStage(0);
    const timers = STAGE_DELAYS.map((delay, index) =>
      window.setTimeout(() => setStage(index + 1), delay)
    );

    if (loop) {
      timers.push(
        window.setTimeout(
          () => setRunKey((current) => current + 1),
          11200
        )
      );
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [loop, play, reducedMotion, runKey]);

  return { stage, replay };
}

function SyncStatus({ stage }: { stage: number }) {
  const status =
    stage >= 10
      ? 'Proposal ready · 1 change'
      : stage >= 9
        ? 'Canvas change → source diff'
        : stage >= 8
          ? 'Source synced · Canvas synced'
          : 'Building one workflow';

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className='flex items-center gap-2 text-[10px] font-medium text-zinc-500 dark:text-zinc-400'
        aria-live='polite'
      >
        <span
          aria-hidden='true'
          className={`h-1.5 w-1.5 rounded-full ${
            stage >= 9 ? 'bg-[#D9A28D]' : 'bg-zinc-400 dark:bg-zinc-600'
          }`}
        />
        {status}
      </motion.div>
    </AnimatePresence>
  );
}

function PreviewSource({ stage }: { stage: number }) {
  const timeout: TimeoutValue = stage >= 9 ? '2h' : '24h';

  return (
    <div className='flex min-h-0 flex-1 flex-col border-b border-zinc-200 bg-zinc-950 sm:border-r sm:border-b-0 dark:border-zinc-800'>
      <div className='flex h-9 items-center justify-between border-b border-white/10 px-4 sm:h-10'>
        <span className='font-mono text-[9px] text-zinc-400 sm:text-[10px]'>release.workflow.ts</span>
        <span className='text-[8px] font-medium tracking-[0.08em] text-zinc-500 uppercase sm:text-[9px]'>TypeScript</span>
      </div>

      <div className='min-h-0 flex-1 overflow-hidden px-3 py-2 font-mono text-[8px] leading-[13px] sm:px-4 sm:py-4 sm:text-[11px] sm:leading-6'>
        {SOURCE_LINES.map((line) => {
          const isVisible = stage >= line.revealAt;
          const step = 'step' in line ? line.step : undefined;
          const text = step
            ? sourceForStep(step, timeout)
            : 'text' in line
              ? line.text
              : '';
          const isWriting =
            stage <= 7 &&
            stage === line.revealAt &&
            line.revealAt > 0;
          const isChanged = step === 'approval' && stage >= 9;

          return (
            <div
              key={line.number}
              className={`grid grid-cols-[18px_minmax(0,1fr)] rounded px-1 transition-colors duration-300 sm:grid-cols-[22px_minmax(0,1fr)] ${
                isChanged ? 'bg-[#D9A28D]/10' : ''
              }`}
            >
              <span className='select-none text-right text-zinc-700'>{line.number}</span>
              <div className='min-w-0 pl-2 sm:pl-3'>
                <AnimatePresence mode='wait' initial={false}>
                  {isVisible && (
                    <motion.span
                      key={`${line.number}-${text}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`block truncate ${
                        isChanged ? 'text-[#E4B8A7]' : 'text-zinc-300'
                      }`}
                    >
                      {text || ' '}
                      {isWriting && (
                        <motion.span
                          aria-hidden='true'
                          className='ml-0.5 inline-block h-2.5 w-px translate-y-0.5 bg-zinc-300 sm:h-3'
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        />
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PreviewCanvas({ stage }: { stage: number }) {
  const timeout: TimeoutValue = stage >= 9 ? '2h' : '24h';

  return (
    <div className='flex min-h-0 flex-1 flex-col bg-white dark:bg-zinc-950'>
      <div className='flex h-9 items-center justify-between border-b border-zinc-200 px-4 sm:h-10 dark:border-zinc-800'>
        <span className='text-[9px] font-medium text-zinc-500 sm:text-[10px] dark:text-zinc-400'>Visual canvas</span>
        <span className='font-mono text-[8px] text-zinc-400 sm:text-[9px] dark:text-zinc-500'>release</span>
      </div>

      <div className='relative flex min-h-0 flex-1 flex-col justify-center px-4 py-2 sm:px-6 sm:py-4'>
        <div className='absolute top-[10%] bottom-[10%] left-[21px] w-px bg-zinc-200 sm:top-[12%] sm:bottom-[12%] sm:left-[39px] dark:bg-zinc-800' />

        <div className='relative space-y-1.5 sm:space-y-2.5'>
          {WORKFLOW_STEPS.map((step) => {
            const visible = stage >= step.revealAt;
            const active =
              (stage <= 7 && stage === step.revealAt) ||
              (step.key === 'approval' && stage >= 9);

            return (
              <AnimatePresence key={step.key} initial={false}>
                {visible && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className='relative flex items-center gap-2 sm:gap-3'
                  >
                    <span
                      aria-hidden='true'
                      className={`relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 transition-colors duration-300 sm:h-3 sm:w-3 ${
                        active
                          ? 'border-[#D9A28D] bg-[#D9A28D]'
                          : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
                      }`}
                    />
                    <div
                      className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 transition-colors duration-300 sm:rounded-lg sm:px-3 sm:py-2 ${
                        active
                          ? 'border-[#D9A28D]/60 bg-[#D9A28D]/5'
                          : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
                      }`}
                    >
                      <div className='min-w-0'>
                        <div className='text-[7px] font-medium tracking-[0.08em] text-zinc-400 uppercase sm:text-[8px] dark:text-zinc-500'>
                          {step.kind}
                        </div>
                        <div className='truncate text-[9px] font-medium text-zinc-900 sm:mt-0.5 sm:text-[11px] dark:text-zinc-100'>
                          {step.label}
                        </div>
                      </div>
                      {step.key === 'approval' && (
                        <AnimatePresence mode='wait' initial={false}>
                          <motion.span
                            key={timeout}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] sm:text-[9px] ${
                              stage >= 9
                                ? 'bg-[#D9A28D]/15 text-[#A86550] dark:text-[#E4B8A7]'
                                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                            }`}
                          >
                            {timeout}
                          </motion.span>
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CodeCanvasPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.42 });
  const { stage } = useBuildSequence(isInView, true);

  return (
    <div ref={sectionRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='grid min-h-0 flex-1 grid-rows-[0.8fr_1.2fr] sm:grid-cols-2 sm:grid-rows-1'>
        <PreviewSource stage={stage} />
        <PreviewCanvas stage={stage} />
      </div>

      <div className='flex items-center justify-between gap-5 border-t border-zinc-200 px-5 py-3.5 sm:px-7 dark:border-zinc-800'>
        <SyncStatus stage={stage} />
        <span className='hidden shrink-0 text-[10px] text-zinc-400 transition-colors group-hover:text-zinc-700 sm:block dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Open synchronized workflow →
        </span>
      </div>
    </div>
  );
}

function InteractiveSource({
  selected,
  timeout,
  onSelect,
}: {
  selected: StepKey;
  timeout: TimeoutValue;
  onSelect: (step: StepKey) => void;
}) {
  return (
    <section className='min-w-0 border-b border-zinc-200 bg-zinc-950 md:border-r md:border-b-0 dark:border-zinc-800'>
      <div className='flex h-11 items-center justify-between border-b border-white/10 px-5'>
        <span className='font-mono text-[11px] text-zinc-400'>release.workflow.ts</span>
        <span className='text-[9px] font-medium tracking-[0.08em] text-zinc-500 uppercase'>Source</span>
      </div>

      <div className='px-3 py-5 font-mono text-[11px] leading-7 sm:px-5'>
        {SOURCE_LINES.map((line) => {
          const step = 'step' in line ? line.step : undefined;
          const text = step
            ? sourceForStep(step, timeout)
            : 'text' in line
              ? line.text
              : '';
          const isSelected = step === selected;

          if (!step) {
            return (
              <div key={line.number} className='grid grid-cols-[25px_minmax(0,1fr)] px-2'>
                <span className='select-none text-right text-zinc-700'>{line.number}</span>
                <span className='truncate pl-3 text-zinc-300'>{text || ' '}</span>
              </div>
            );
          }

          return (
            <button
              key={line.number}
              type='button'
              onClick={() => onSelect(step)}
              className={`grid w-full grid-cols-[25px_minmax(0,1fr)] rounded px-2 text-left transition-colors focus-visible:ring-1 focus-visible:ring-[#D9A28D] focus-visible:outline-none ${
                isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/5'
              }`}
            >
              <span className='select-none text-right text-zinc-700'>{line.number}</span>
              <span className={`truncate pl-3 ${isSelected ? 'text-[#E4B8A7]' : 'text-zinc-300'}`}>
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function InteractiveCanvas({
  selected,
  timeout,
  onSelect,
  onTimeoutChange,
}: {
  selected: StepKey;
  timeout: TimeoutValue;
  onSelect: (step: StepKey) => void;
  onTimeoutChange: (timeout: TimeoutValue) => void;
}) {
  const selectedStep = WORKFLOW_STEPS.find((step) => step.key === selected) ?? WORKFLOW_STEPS[0];

  return (
    <section className='min-w-0 bg-white dark:bg-zinc-950'>
      <div className='flex h-11 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800'>
        <span className='text-[11px] font-medium text-zinc-500 dark:text-zinc-400'>Visual canvas</span>
        <span className='font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>Synced</span>
      </div>

      <div className='grid min-h-[360px] sm:grid-cols-[1fr_180px]'>
        <div className='relative px-6 py-6 sm:px-7'>
          <div className='absolute top-9 bottom-9 left-[33px] w-px bg-zinc-200 sm:left-[41px] dark:bg-zinc-800' />
          <div className='relative space-y-3'>
            {WORKFLOW_STEPS.map((step) => {
              const active = selected === step.key;

              return (
                <button
                  key={step.key}
                  type='button'
                  onClick={() => onSelect(step.key)}
                  className='relative flex w-full items-center gap-3 text-left focus-visible:outline-none'
                >
                  <span
                    aria-hidden='true'
                    className={`relative z-10 h-3 w-3 shrink-0 rounded-full border-2 transition-colors ${
                      active
                        ? 'border-[#D9A28D] bg-[#D9A28D]'
                        : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
                    }`}
                  />
                  <span
                    className={`flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition-colors ${
                      active
                        ? 'border-[#D9A28D]/60 bg-[#D9A28D]/5'
                        : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className='min-w-0'>
                      <span className='block text-[8px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
                        {step.kind}
                      </span>
                      <span className='mt-0.5 block truncate text-xs font-medium text-zinc-900 dark:text-zinc-100'>
                        {step.label}
                      </span>
                    </span>
                    {step.key === 'approval' && (
                      <span className='shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'>
                        {timeout}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className='border-t border-zinc-200 bg-zinc-50 p-5 sm:border-t-0 sm:border-l dark:border-zinc-800 dark:bg-zinc-900/40'>
          <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
            Inspector
          </div>
          <div className='mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            {selectedStep.label}
          </div>
          <p className='mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
            {selectedStep.description}
          </p>

          {selected === 'approval' && (
            <div className='mt-6'>
              <label className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
                Timeout
              </label>
              <div className='mt-2 grid grid-cols-2 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950'>
                {(['24h', '2h'] as const).map((value) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => onTimeoutChange(value)}
                    className={`rounded-md px-2 py-1.5 font-mono text-[10px] transition-colors focus-visible:ring-1 focus-visible:ring-[#D9A28D] focus-visible:outline-none ${
                      timeout === value
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ProposalPanel({ timeout, onReset }: { timeout: TimeoutValue; onReset: () => void }) {
  const changed = timeout === '2h';

  return (
    <div className='border-t border-zinc-200 dark:border-zinc-800'>
      <div className='flex items-center justify-between gap-5 px-6 py-4 sm:px-8'>
        <div>
          <div className='text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
            Git proposal
          </div>
          <div className='mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            {changed ? 'Proposal #184 · Ready for review' : 'No source change yet'}
          </div>
        </div>
        {changed && (
          <button
            type='button'
            onClick={onReset}
            className='rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
          >
            Reset change
          </button>
        )}
      </div>

      <AnimatePresence mode='wait' initial={false}>
        {changed ? (
          <motion.div
            key='diff'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden'
          >
            <div className='grid border-t border-zinc-200 bg-zinc-950 font-mono text-[11px] leading-7 dark:border-zinc-800 sm:grid-cols-[1fr_220px]'>
              <div className='px-6 py-4 sm:px-8'>
                <div className='text-zinc-500'>workflow/release.workflow.ts</div>
                <div className='mt-2 rounded bg-red-500/[0.08] px-2 text-red-300'>
                  {'- awaitApproval({ timeout: "24h" }),' }
                </div>
                <div className='rounded bg-emerald-500/[0.08] px-2 text-emerald-300'>
                  {'+ awaitApproval({ timeout: "2h" }),' }
                </div>
              </div>
              <div className='border-t border-white/10 px-6 py-4 text-zinc-400 sm:border-t-0 sm:border-l sm:px-5'>
                <span className='block text-[9px] font-medium tracking-[0.08em] text-zinc-500 uppercase'>
                  Review state
                </span>
                <span className='mt-2 block text-zinc-300'>1 file changed</span>
                <span className='block'>Canvas and source agree</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='empty'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='border-t border-zinc-200 px-6 py-4 text-xs text-zinc-500 sm:px-8 dark:border-zinc-800 dark:text-zinc-400'
          >
            Select the approval gate and change its timeout. Flowcordia will produce the exact source diff.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CodeCanvasDetails() {
  const [selected, setSelected] = useState<StepKey>('approval');
  const [timeout, setTimeout] = useState<TimeoutValue>('24h');

  const changed = timeout === '2h';
  const status = useMemo(
    () => (changed ? 'Canvas changed · Source updated · Proposal ready' : 'Source and canvas synchronized'),
    [changed]
  );

  const changeTimeout = useCallback((value: TimeoutValue) => {
    setSelected('approval');
    setTimeout(value);
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between gap-5 border-y border-zinc-200 px-6 py-3 text-[10px] text-zinc-500 sm:px-8 dark:border-zinc-800 dark:text-zinc-400'>
        <span className='font-mono'>acme/release-platform · workflow/release.workflow.ts</span>
        <span className='hidden items-center gap-2 sm:flex'>
          <span className={`h-1.5 w-1.5 rounded-full ${changed ? 'bg-[#D9A28D]' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
          {status}
        </span>
      </div>

      <div className='grid md:grid-cols-2'>
        <InteractiveSource selected={selected} timeout={timeout} onSelect={setSelected} />
        <InteractiveCanvas
          selected={selected}
          timeout={timeout}
          onSelect={setSelected}
          onTimeoutChange={changeTimeout}
        />
      </div>

      <ProposalPanel timeout={timeout} onReset={() => setTimeout('24h')} />
    </div>
  );
}
