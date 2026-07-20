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

type BandKey = 'identity' | 'environment' | 'secret' | 'approval';
type PolicyKey = 'production' | 'export' | 'reset';

type PolicyBand = {
  key: BandKey;
  label: string;
  value: string;
  rule: string;
  source: string;
  side: 'left' | 'right';
};

type PolicyScenario = {
  eyebrow: string;
  title: string;
  summary: string;
  release: string;
  commit: string;
  blockingBand: BandKey;
  blockedMessage: string;
  resolvedMessage: string;
  action: string;
  bands: PolicyBand[];
};

const SCENARIOS: Record<PolicyKey, PolicyScenario> = {
  production: {
    eyebrow: 'Production release',
    title: 'Deploy payment reconciliation',
    summary:
      'The exact release policy is evaluated before the first production step can begin.',
    release: 'release_227',
    commit: '7f91b2d',
    blockingBand: 'approval',
    blockedMessage: 'Production requires 2 reviewers · 1 received',
    resolvedMessage: 'Second review recorded · release may execute',
    action: 'Record second review',
    bands: [
      {
        key: 'identity',
        label: 'Identity',
        value: 'Release manager',
        rule: 'requireRole("release-manager")',
        source: 'policies/production.ts:12',
        side: 'left',
      },
      {
        key: 'environment',
        label: 'Environment',
        value: 'Production only',
        rule: 'requireEnvironment("production")',
        source: 'policies/production.ts:18',
        side: 'right',
      },
      {
        key: 'secret',
        label: 'Secret scope',
        value: 'DEPLOY_TOKEN',
        rule: 'requireSecret("DEPLOY_TOKEN", "worker")',
        source: 'policies/production.ts:24',
        side: 'left',
      },
      {
        key: 'approval',
        label: 'Approval',
        value: '2 reviewers',
        rule: 'requireApprovals(2)',
        source: 'policies/production.ts:31',
        side: 'right',
      },
    ],
  },
  export: {
    eyebrow: 'Customer data export',
    title: 'Export account history',
    summary:
      'Sensitive data can leave the private worker only when the actor and export policy agree.',
    release: 'export_081',
    commit: '12a4c88',
    blockingBand: 'identity',
    blockedMessage: 'Data steward role required · analyst detected',
    resolvedMessage: 'Data steward assigned · export policy satisfied',
    action: 'Assign data steward',
    bands: [
      {
        key: 'identity',
        label: 'Identity',
        value: 'Data steward',
        rule: 'requireRole("data-steward")',
        source: 'policies/data-export.ts:9',
        side: 'left',
      },
      {
        key: 'environment',
        label: 'Environment',
        value: 'Private worker',
        rule: 'requireWorker("private-vpc")',
        source: 'policies/data-export.ts:15',
        side: 'right',
      },
      {
        key: 'secret',
        label: 'Secret scope',
        value: 'EXPORT_KEY',
        rule: 'requireSecret("EXPORT_KEY", "export")',
        source: 'policies/data-export.ts:22',
        side: 'left',
      },
      {
        key: 'approval',
        label: 'Approval',
        value: 'Ticket linked',
        rule: 'requireReference("privacy-ticket")',
        source: 'policies/data-export.ts:28',
        side: 'right',
      },
    ],
  },
  reset: {
    eyebrow: 'Internal recovery',
    title: 'Reset a locked account',
    summary:
      'An emergency workflow still receives the same explicit secret, network, and audit boundaries.',
    release: 'recovery_044',
    commit: 'e82c04a',
    blockingBand: 'secret',
    blockedMessage: 'Recovery secret unavailable in this worker scope',
    resolvedMessage: 'Recovery secret mounted · action remains audited',
    action: 'Use recovery worker',
    bands: [
      {
        key: 'identity',
        label: 'Identity',
        value: 'On-call engineer',
        rule: 'requireOnCall("identity")',
        source: 'policies/recovery.ts:11',
        side: 'left',
      },
      {
        key: 'environment',
        label: 'Environment',
        value: 'Internal VPC',
        rule: 'requireNetwork("internal")',
        source: 'policies/recovery.ts:17',
        side: 'right',
      },
      {
        key: 'secret',
        label: 'Secret scope',
        value: 'RECOVERY_KEY',
        rule: 'requireSecret("RECOVERY_KEY", "recovery")',
        source: 'policies/recovery.ts:23',
        side: 'left',
      },
      {
        key: 'approval',
        label: 'Approval',
        value: 'Incident linked',
        rule: 'requireReference("incident")',
        source: 'policies/recovery.ts:29',
        side: 'right',
      },
    ],
  },
};

const BAND_TOPS: Record<BandKey, number> = {
  identity: 21,
  environment: 38,
  secret: 55,
  approval: 72,
};

function bandIndex(key: BandKey) {
  return ['identity', 'environment', 'secret', 'approval'].indexOf(key);
}

function PolicyLoomGraphic({
  scenario,
  resolved,
  selected,
  onSelect,
  phase,
  compact = false,
}: {
  scenario: PolicyScenario;
  resolved: boolean;
  selected?: BandKey;
  onSelect?: (key: BandKey) => void;
  phase?: number;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const activeCount = phase === undefined ? 4 : Math.min(Math.max(phase, 0), 4);
  const tokenTop = 11 + activeCount * 16.7;

  return (
    <div className='relative h-full w-full overflow-hidden bg-[#fbfbfa] dark:bg-zinc-950'>
      <div
        aria-hidden='true'
        className='absolute inset-0 opacity-55 dark:opacity-25'
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(113,113,122,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(113,113,122,0.08) 1px, transparent 1px)',
          backgroundSize: compact ? '26px 26px' : '32px 32px',
        }}
      />

      <div className='absolute top-5 left-5 z-20 font-mono text-[8px] tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-500 sm:top-7 sm:left-8'>
        Policy loom · {scenario.release}
      </div>
      <div className='absolute top-5 right-5 z-20 font-mono text-[8px] text-zinc-400 dark:text-zinc-500 sm:top-7 sm:right-8'>
        commit {scenario.commit}
      </div>

      <div className='absolute top-[11%] bottom-[10%] left-1/2 z-0 w-px -translate-x-1/2 bg-zinc-300 dark:bg-zinc-700' />
      <div className='absolute top-[11%] left-1/2 z-10 h-2 w-2 -translate-x-1/2 rounded-full border border-zinc-400 bg-white dark:border-zinc-600 dark:bg-zinc-950' />

      {scenario.bands.map((band, index) => {
        const active = index < activeCount || phase === undefined;
        const blocked = band.key === scenario.blockingBand && !resolved && active;
        const isSelected = selected === band.key;
        const leftBand = band.side === 'left';

        return (
          <button
            key={band.key}
            type='button'
            onClick={() => onSelect?.(band.key)}
            disabled={!onSelect}
            className={`absolute z-10 h-[58px] text-left sm:h-[66px] ${
              leftBand ? 'left-[4%] w-[46%]' : 'right-[4%] w-[46%]'
            } ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ top: `${BAND_TOPS[band.key]}%` }}
          >
            <motion.div
              initial={false}
              animate={{
                opacity: active ? 1 : 0.28,
                x: active ? 0 : leftBand ? -18 : 18,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : index * 0.07,
                ease: 'easeOut',
              }}
              className={`relative flex h-full items-center border-y px-3 sm:px-5 ${
                leftBand ? 'justify-start border-l' : 'justify-end border-r text-right'
              } ${
                blocked
                  ? 'border-[#D9A28D] bg-[#D9A28D]/12'
                  : isSelected
                    ? 'border-zinc-500 bg-white/90 dark:border-zinc-500 dark:bg-zinc-900/90'
                    : active
                      ? 'border-zinc-300 bg-white/78 dark:border-zinc-700 dark:bg-zinc-900/72'
                      : 'border-zinc-200 bg-white/40 dark:border-zinc-800 dark:bg-zinc-950/40'
              }`}
            >
              <div className='relative z-10 max-w-[150px] sm:max-w-[210px]'>
                <div className='text-[8px] font-medium tracking-[0.11em] text-zinc-400 uppercase dark:text-zinc-500'>
                  {band.label}
                </div>
                <div
                  className={`mt-1 truncate font-mono text-[9px] sm:text-[10px] ${
                    blocked
                      ? 'text-[#9b6755] dark:text-[#e0ae99]'
                      : 'text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  {band.value}
                </div>
              </div>

              <motion.div
                aria-hidden='true'
                className={`absolute top-1/2 h-px ${
                  leftBand ? 'right-0 left-0' : 'right-0 left-0'
                } ${blocked ? 'bg-[#D9A28D]' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                initial={false}
                animate={{ scaleX: active ? 1 : 0.2 }}
                style={{ transformOrigin: leftBand ? 'left center' : 'right center' }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: index * 0.08 }}
              />
            </motion.div>

            <motion.span
              aria-hidden='true'
              className={`absolute top-1/2 z-20 h-3 w-3 -translate-y-1/2 rounded-full border ${
                leftBand ? '-right-1.5' : '-left-1.5'
              } ${
                blocked
                  ? 'border-[#D9A28D] bg-[#fbfbfa] dark:bg-zinc-950'
                  : active
                    ? 'border-zinc-500 bg-[#fbfbfa] dark:border-zinc-500 dark:bg-zinc-950'
                    : 'border-zinc-300 bg-[#fbfbfa] dark:border-zinc-700 dark:bg-zinc-950'
              }`}
              animate={
                blocked && !reduceMotion
                  ? { scale: [1, 1.25, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 1.2, repeat: blocked ? Infinity : 0 }}
            />
          </button>
        );
      })}

      <motion.div
        aria-label='Release policy evaluation position'
        className='absolute left-1/2 z-30 w-[116px] -translate-x-1/2 rounded-full border border-zinc-300 bg-white px-3 py-2 text-center shadow-[0_8px_26px_rgba(9,9,11,0.08)] dark:border-zinc-700 dark:bg-zinc-900 sm:w-[138px]'
        initial={false}
        animate={{ top: `${tokenTop}%` }}
        transition={{
          type: 'spring',
          bounce: 0.12,
          duration: reduceMotion ? 0 : 0.55,
        }}
      >
        <div className='text-[7px] font-medium tracking-[0.12em] text-zinc-400 uppercase dark:text-zinc-500'>
          Exact release
        </div>
        <div className='mt-1 font-mono text-[8px] text-zinc-800 dark:text-zinc-200'>
          {scenario.release}
        </div>
      </motion.div>

      <motion.div
        className={`absolute bottom-[4%] left-1/2 z-20 flex h-[70px] w-[70px] -translate-x-1/2 items-center justify-center rounded-full border text-center sm:h-[82px] sm:w-[82px] ${
          resolved
            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
            : 'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500'
        }`}
        initial={false}
        animate={{
          scale: resolved ? 1 : 0.92,
          rotate: resolved && !reduceMotion ? [0, -3, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className='text-[7px] tracking-[0.11em] uppercase'>Policy</div>
          <div className='mt-1 font-mono text-[8px] font-medium'>
            {resolved ? 'SEALED' : 'WAITING'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ClosedPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.42 });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(reduceMotion ? 6 : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    const durations = [650, 720, 720, 780, 1500, 850, 2300];

    const advance = (next: number) => {
      setPhase(next);
      timer = setTimeout(() => advance(next >= 6 ? 0 : next + 1), durations[next]);
    };

    advance(0);
    return () => clearTimeout(timer);
  }, [inView, reduceMotion]);

  const resolved = phase >= 5;
  const status =
    phase < 4
      ? 'Evaluating release policy'
      : phase === 4
        ? SCENARIOS.production.blockedMessage
        : phase === 5
          ? SCENARIOS.production.resolvedMessage
          : 'Policy sealed · production execution allowed';

  return (
    <div ref={rootRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='relative min-h-[420px] flex-1 border-y border-zinc-200 dark:border-zinc-800 sm:min-h-[360px]'>
        <PolicyLoomGraphic
          scenario={SCENARIOS.production}
          resolved={resolved}
          phase={phase}
          compact
        />
      </div>
      <div className='flex items-center justify-between gap-5 px-7 py-5 sm:px-10'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className='text-xs font-medium text-zinc-800 dark:text-zinc-200'>
              {status}
            </div>
            <div className='mt-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
              identity · environment · secrets · approvals
            </div>
          </motion.div>
        </AnimatePresence>
        <span className='shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Inspect policy →
        </span>
      </div>
    </div>
  );
}

function PolicyInspector() {
  const [policyKey, setPolicyKey] = useState<PolicyKey>('production');
  const [selected, setSelected] = useState<BandKey>('approval');
  const [resolved, setResolved] = useState(false);
  const policy = SCENARIOS[policyKey];
  const selectedBand = useMemo(
    () => policy.bands.find((band) => band.key === selected) ?? policy.bands[0],
    [policy, selected]
  );
  const selectedBlocked = selected === policy.blockingBand && !resolved;

  const selectPolicy = (next: PolicyKey) => {
    setPolicyKey(next);
    setSelected(SCENARIOS[next].blockingBand);
    setResolved(false);
  };

  return (
    <div>
      <div className='border-y border-zinc-200 dark:border-zinc-800'>
        <div className='grid border-b border-zinc-200 dark:border-zinc-800 sm:grid-cols-3'>
          {(Object.keys(SCENARIOS) as PolicyKey[]).map((key) => {
            const item = SCENARIOS[key];
            const active = key === policyKey;
            return (
              <button
                key={key}
                type='button'
                onClick={() => selectPolicy(key)}
                className={`px-5 py-4 text-left transition-colors sm:border-r sm:last:border-r-0 dark:sm:border-zinc-800 ${
                  active
                    ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900'
                }`}
              >
                <span
                  className={`block text-[8px] font-medium tracking-[0.1em] uppercase ${
                    active ? 'text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {item.eyebrow}
                </span>
                <span className='mt-1.5 block text-xs font-medium'>{item.title}</span>
              </button>
            );
          })}
        </div>

        <div className='relative h-[590px] sm:h-[540px]'>
          <PolicyLoomGraphic
            scenario={policy}
            resolved={resolved}
            selected={selected}
            onSelect={setSelected}
          />

          <AnimatePresence mode='wait'>
            <motion.div
              key={`${policyKey}-${selected}-${resolved}`}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: 0.2 }}
              className='absolute right-5 bottom-5 left-5 z-40 rounded-2xl border border-zinc-200 bg-white/96 p-4 shadow-[0_14px_44px_rgba(9,9,11,0.11)] backdrop-blur sm:right-7 sm:left-auto sm:w-[330px] dark:border-zinc-800 dark:bg-zinc-950/96'
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='text-[8px] font-medium tracking-[0.11em] text-zinc-400 uppercase dark:text-zinc-500'>
                    {selectedBand.label}
                  </div>
                  <div className='mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50'>
                    {selectedBand.value}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 font-mono text-[8px] ${
                    selectedBlocked
                      ? 'bg-[#D9A28D]/16 text-[#9b6755] dark:text-[#e0ae99]'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {selectedBlocked ? 'requirement missing' : 'satisfied'}
                </span>
              </div>
              <div className='mt-3 rounded-lg border border-zinc-200 bg-zinc-950 px-3 py-2.5 font-mono text-[9px] leading-5 text-zinc-300 dark:border-zinc-800'>
                {selectedBand.rule}
              </div>
              <div className='mt-2 font-mono text-[8px] text-zinc-400 dark:text-zinc-500'>
                {selectedBand.source}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className='px-6 py-6 sm:px-9 sm:py-8'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='max-w-xl'>
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              {resolved ? policy.resolvedMessage : policy.blockedMessage}
            </div>
            <p className='mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
              {policy.summary}
            </p>
          </div>
          <button
            type='button'
            onClick={() => setResolved(true)}
            disabled={resolved}
            className='shrink-0 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-45 dark:bg-zinc-50 dark:text-zinc-950'
          >
            {resolved ? 'Policy sealed' : policy.action}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PolicyLoomWorkflow() {
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
              08 · Policy as code
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Every workflow carries its policy with it.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Identity, environment, secret scope, and approvals are evaluated together before execution begins.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            policy v4
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
              Policy inspector
            </div>
            <MorphingDialogTitle className='mt-3 max-w-3xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Trace the rule that allowed—or stopped—the run.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Select a policy band, inspect its exact source rule, and satisfy the missing requirement without bypassing production governance.
            </MorphingDialogSubtitle>
          </div>

          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, scale: 0.985 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.985 },
            }}
          >
            <PolicyInspector />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
