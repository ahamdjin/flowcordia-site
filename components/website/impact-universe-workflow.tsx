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

type NodeId =
  | 'deployment-api'
  | 'release-history'
  | 'notify-team'
  | 'status-page'
  | 'billing-reconcile'
  | 'release-metrics'
  | 'audit-export';

type Impact = 'idle' | 'compatible' | 'update' | 'blocked';
type ScenarioKey = 'rename' | 'optional' | 'remove';

type UniverseNode = {
  id: NodeId;
  label: string;
  kind: string;
  x: number;
  y: number;
  code: string;
};

type Scenario = {
  eyebrow: string;
  change: string;
  description: string;
  summary: string;
  action: string;
  impacts: Record<NodeId, Impact>;
  reasons: Record<NodeId, string>;
};

const NODES: UniverseNode[] = [
  {
    id: 'deployment-api',
    label: 'Deployment API',
    kind: 'service',
    x: 50,
    y: 10,
    code: 'deploymentApi.publish(event.releaseId)',
  },
  {
    id: 'release-history',
    label: 'Release history',
    kind: 'database',
    x: 79,
    y: 23,
    code: 'releaseHistory.insert(event)',
  },
  {
    id: 'notify-team',
    label: 'Notify team',
    kind: 'workflow',
    x: 88,
    y: 59,
    code: 'owner: event.customerId',
  },
  {
    id: 'status-page',
    label: 'Status page',
    kind: 'webhook',
    x: 68,
    y: 86,
    code: 'statusPage.publish(event.releaseId)',
  },
  {
    id: 'billing-reconcile',
    label: 'Billing reconcile',
    kind: 'workflow',
    x: 32,
    y: 86,
    code: 'account: event.customerId',
  },
  {
    id: 'release-metrics',
    label: 'Release metrics',
    kind: 'stream',
    x: 12,
    y: 59,
    code: 'metrics.write(event.durationMs)',
  },
  {
    id: 'audit-export',
    label: 'Audit export',
    kind: 'workflow',
    x: 21,
    y: 23,
    code: 'audit.append(event)',
  },
];

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  rename: {
    eyebrow: 'Contract rename',
    change: 'customerId → accountId',
    description:
      'Rename a required event field and follow every consumer before the proposal can merge.',
    summary: '7 dependencies checked · 2 coordinated updates required',
    action: 'Prepare 2 updates',
    impacts: {
      'deployment-api': 'compatible',
      'release-history': 'compatible',
      'notify-team': 'update',
      'status-page': 'compatible',
      'billing-reconcile': 'update',
      'release-metrics': 'compatible',
      'audit-export': 'compatible',
    },
    reasons: {
      'deployment-api': 'Consumes releaseId only. No source change required.',
      'release-history': 'Stores the complete payload without a rigid field projection.',
      'notify-team': 'Reads event.customerId directly and needs a coordinated source update.',
      'status-page': 'Consumes releaseId only. The contract remains compatible.',
      'billing-reconcile': 'Maps event.customerId into the billing account lookup.',
      'release-metrics': 'Consumes durationMs only. No impact detected.',
      'audit-export': 'Serializes the full event and accepts the new schema version.',
    },
  },
  optional: {
    eyebrow: 'Optional field',
    change: 'add region?: string',
    description:
      'Add an optional field and prove that existing consumers remain compatible.',
    summary: '7 dependencies checked · safe to publish',
    action: 'Attach impact report',
    impacts: {
      'deployment-api': 'compatible',
      'release-history': 'compatible',
      'notify-team': 'compatible',
      'status-page': 'compatible',
      'billing-reconcile': 'compatible',
      'release-metrics': 'compatible',
      'audit-export': 'compatible',
    },
    reasons: {
      'deployment-api': 'Existing input remains valid because region is optional.',
      'release-history': 'The event store accepts additional payload properties.',
      'notify-team': 'No required projection changed.',
      'status-page': 'No required projection changed.',
      'billing-reconcile': 'No required projection changed.',
      'release-metrics': 'Can begin reading region later without blocking this change.',
      'audit-export': 'The export schema permits additional optional properties.',
    },
  },
  remove: {
    eyebrow: 'Event removal',
    change: 'remove release.failed',
    description:
      'Remove an event and surface the workflows that would stop receiving work.',
    summary: '7 dependencies checked · 3 consumers block removal',
    action: 'Prepare migration plan',
    impacts: {
      'deployment-api': 'idle',
      'release-history': 'compatible',
      'notify-team': 'blocked',
      'status-page': 'blocked',
      'billing-reconcile': 'idle',
      'release-metrics': 'compatible',
      'audit-export': 'blocked',
    },
    reasons: {
      'deployment-api': 'Does not subscribe to release.failed.',
      'release-history': 'Historical records remain readable after the event is retired.',
      'notify-team': 'Uses release.failed as its only trigger and would stop running.',
      'status-page': 'Publishes incidents directly from release.failed.',
      'billing-reconcile': 'Does not subscribe to release.failed.',
      'release-metrics': 'Aggregates both success and failure events but can tolerate removal.',
      'audit-export': 'Requires release.failed to maintain the compliance export sequence.',
    },
  },
};

const DEFAULT_SELECTION: Record<ScenarioKey, NodeId> = {
  rename: 'notify-team',
  optional: 'release-metrics',
  remove: 'status-page',
};

const PHASE_COPY = [
  ['System mapped', '7 live dependencies discovered'],
  ['Change proposed', 'release.completed · schema v2'],
  ['Contracts propagating', 'Following every downstream consumer'],
  ['Source impact found', '2 workflows read customerId directly'],
  ['Blast radius known', '2 coordinated updates before merge'],
] as const;

function useImpactSequence(active: boolean) {
  const [phase, setPhase] = useState(0);
  const [sequenceKey, setSequenceKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;

    if (reduceMotion) {
      setPhase(PHASE_COPY.length - 1);
      return;
    }

    setPhase(0);
    const timers = [1000, 2250, 3650, 5250].map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );
    timers.push(
      window.setTimeout(
        () => setSequenceKey((current) => current + 1),
        9000
      )
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [active, reduceMotion, sequenceKey]);

  return phase;
}

function impactLabel(impact: Impact) {
  if (impact === 'update') return 'update';
  if (impact === 'blocked') return 'blocked';
  if (impact === 'compatible') return 'safe';
  return 'unaffected';
}

function NodeMark({
  node,
  impact,
  selected,
  revealed,
  interactive,
  onSelect,
}: {
  node: UniverseNode;
  impact: Impact;
  selected: boolean;
  revealed: boolean;
  interactive: boolean;
  onSelect?: (id: NodeId) => void;
}) {
  const active = revealed && impact !== 'idle';
  const needsAttention = impact === 'update' || impact === 'blocked';

  const body = (
    <>
      <motion.span
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-[0_1px_3px_rgba(9,9,11,0.06)] transition-colors dark:bg-zinc-950 ${
          selected
            ? 'border-zinc-950 dark:border-zinc-50'
            : needsAttention && active
              ? 'border-[#D9A28D]'
              : active
                ? 'border-zinc-500 dark:border-zinc-400'
                : 'border-zinc-200 dark:border-zinc-800'
        }`}
        animate={{
          scale: selected ? 1.1 : active ? 1 : 0.92,
          opacity: active || !revealed ? 1 : 0.52,
        }}
        transition={{ duration: 0.28 }}
      >
        {needsAttention && active && (
          <motion.span
            aria-hidden='true'
            className='absolute inset-[-5px] rounded-full border border-[#D9A28D]/40'
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            needsAttention && active
              ? 'bg-[#D9A28D]'
              : active
                ? 'bg-zinc-900 dark:bg-zinc-100'
                : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
        />
      </motion.span>
      <span className='mt-2 block whitespace-nowrap text-center text-[10px] font-medium text-zinc-800 dark:text-zinc-200'>
        {node.label}
      </span>
      <span className='mt-0.5 block text-center font-mono text-[8px] text-zinc-400 dark:text-zinc-500'>
        {revealed ? impactLabel(impact) : node.kind}
      </span>
    </>
  );

  const position = {
    left: `${node.x}%`,
    top: `${node.y}%`,
  };

  if (interactive) {
    return (
      <motion.button
        type='button'
        style={position}
        className='absolute z-20 flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-4 dark:focus-visible:ring-zinc-50 dark:focus-visible:ring-offset-zinc-950'
        onClick={() => onSelect?.(node.id)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        {body}
      </motion.button>
    );
  }

  return (
    <motion.div
      style={position}
      className='absolute z-20 flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center'
    >
      {body}
    </motion.div>
  );
}

function UniverseGraph({
  scenarioKey,
  selected,
  onSelect,
  phase,
  interactive = false,
}: {
  scenarioKey: ScenarioKey;
  selected?: NodeId;
  onSelect?: (id: NodeId) => void;
  phase?: number;
  interactive?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const scenario = SCENARIOS[scenarioKey];
  const revealed = phase === undefined || phase >= 2;
  const attentionRevealed = phase === undefined || phase >= 3;

  return (
    <div className='relative h-full min-h-[430px] w-full overflow-hidden bg-[#fbfbfa] dark:bg-zinc-950'>
      <div className='absolute inset-0'>
        {[21, 34, 46].map((diameter, index) => (
          <motion.div
            key={diameter}
            aria-hidden='true'
            className='absolute top-1/2 left-1/2 rounded-full border border-zinc-200/80 dark:border-zinc-800/80'
            style={{
              width: `${diameter * 2}%`,
              height: `${diameter * 2}%`,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.012 + index * 0.004, 1] }
            }
            transition={{
              duration: 4.8 + index,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {!reduceMotion && (
          <motion.div
            aria-hidden='true'
            className='absolute top-1/2 left-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          >
            <span className='absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-300 dark:bg-zinc-700' />
          </motion.div>
        )}

        <svg
          aria-hidden='true'
          className='absolute inset-0 h-full w-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          {NODES.map((node, index) => {
            const impact = scenario.impacts[node.id];
            const active = revealed && impact !== 'idle';
            const needsAttention =
              attentionRevealed &&
              (impact === 'update' || impact === 'blocked');

            return (
              <motion.line
                key={node.id}
                x1='50'
                y1='50'
                x2={node.x}
                y2={node.y}
                vectorEffect='non-scaling-stroke'
                strokeWidth={needsAttention ? 1.4 : 1}
                strokeDasharray={needsAttention ? '4 4' : undefined}
                className={
                  needsAttention
                    ? 'stroke-[#D9A28D]'
                    : active
                      ? 'stroke-zinc-400 dark:stroke-zinc-600'
                      : 'stroke-zinc-200 dark:stroke-zinc-800'
                }
                initial={false}
                animate={{
                  opacity: active || !revealed ? 1 : 0.3,
                  pathLength: active ? 1 : revealed ? 0.25 : 0.65,
                }}
                transition={{
                  duration: 0.75,
                  delay: active ? index * 0.07 : 0,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </svg>

        <motion.div
          className='absolute top-1/2 left-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-center shadow-[0_8px_30px_rgba(9,9,11,0.07)] dark:border-zinc-700 dark:bg-zinc-900'
          animate={{
            scale: phase !== undefined && phase === 1 ? 1.045 : 1,
          }}
          transition={{ duration: 0.35 }}
        >
          <span className='text-[8px] font-medium tracking-[0.12em] text-zinc-400 uppercase dark:text-zinc-500'>
            Event contract
          </span>
          <span className='mt-2 font-mono text-[11px] font-medium text-zinc-950 dark:text-zinc-50'>
            release.completed
          </span>
          <span className='mt-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>
            schema v1 → v2
          </span>
          <span className='mt-4 rounded-full border border-[#D9A28D]/50 px-2.5 py-1 font-mono text-[9px] text-[#9b6755] dark:text-[#e0ae99]'>
            {scenario.change}
          </span>
        </motion.div>

        {NODES.map((node) => (
          <NodeMark
            key={node.id}
            node={node}
            impact={scenario.impacts[node.id]}
            selected={selected === node.id}
            revealed={revealed}
            interactive={interactive}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function ClosedPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { amount: 0.42 });
  const phase = useImpactSequence(inView);
  const current = PHASE_COPY[phase];

  return (
    <div ref={previewRef} className='flex min-h-0 flex-1 flex-col'>
      <div className='relative min-h-0 flex-1 border-t border-zinc-200 dark:border-zinc-800'>
        <UniverseGraph scenarioKey='rename' phase={phase} />
      </div>

      <div className='flex items-end justify-between gap-5 border-t border-zinc-200 bg-white px-6 py-5 sm:px-8 dark:border-zinc-800 dark:bg-zinc-950'>
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
              {current[0]}
            </div>
            <div className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
              {current[1]}
            </div>
          </motion.div>
        </AnimatePresence>
        <span className='shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Explore impact →
        </span>
      </div>
    </div>
  );
}

function ImpactExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('rename');
  const [selected, setSelected] = useState<NodeId>(DEFAULT_SELECTION.rename);
  const [prepared, setPrepared] = useState(false);
  const scenario = SCENARIOS[scenarioKey];
  const selectedNode = NODES.find((node) => node.id === selected) ?? NODES[0];
  const selectedImpact = scenario.impacts[selectedNode.id];

  const selectScenario = (next: ScenarioKey) => {
    setScenarioKey(next);
    setSelected(DEFAULT_SELECTION[next]);
    setPrepared(false);
  };

  return (
    <div>
      <div className='relative h-[600px] overflow-hidden border-y border-zinc-200 dark:border-zinc-800 sm:h-[560px]'>
        <UniverseGraph
          scenarioKey={scenarioKey}
          selected={selected}
          onSelect={setSelected}
          interactive
        />

        <AnimatePresence mode='wait'>
          <motion.div
            key={`${scenarioKey}-${selected}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className='absolute bottom-5 left-5 z-30 w-[calc(100%-40px)] max-w-[310px] rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(9,9,11,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95'
          >
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='text-[9px] font-medium tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-500'>
                  {selectedNode.kind}
                </div>
                <div className='mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50'>
                  {selectedNode.label}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 font-mono text-[8px] ${
                  selectedImpact === 'update' || selectedImpact === 'blocked'
                    ? 'bg-[#D9A28D]/15 text-[#9b6755] dark:text-[#e0ae99]'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                }`}
              >
                {impactLabel(selectedImpact)}
              </span>
            </div>
            <p className='mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
              {scenario.reasons[selectedNode.id]}
            </p>
            <div className='mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 px-3 py-2.5 font-mono text-[9px] leading-5 text-zinc-300 dark:border-zinc-800'>
              {selectedNode.code}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='px-6 py-6 sm:px-9 sm:py-8'>
        <div className='grid gap-2 sm:grid-cols-3'>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
            const item = SCENARIOS[key];
            const active = key === scenarioKey;
            return (
              <button
                key={key}
                type='button'
                onClick={() => selectScenario(key)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <span className={`block text-[9px] uppercase tracking-[0.09em] ${active ? 'text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {item.eyebrow}
                </span>
                <span className='mt-1.5 block font-mono text-[10px]'>
                  {item.change}
                </span>
              </button>
            );
          })}
        </div>

        <div className='mt-6 flex flex-col gap-5 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800'>
          <div className='max-w-xl'>
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              {prepared ? 'Coordinated change prepared' : scenario.summary}
            </div>
            <div className='mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
              {prepared
                ? 'The impact report, source updates, and migration notes are attached to one reviewable proposal.'
                : scenario.description}
            </div>
          </div>
          <button
            type='button'
            onClick={() => setPrepared(true)}
            disabled={prepared}
            className='shrink-0 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-45 dark:bg-zinc-50 dark:text-zinc-950'
          >
            {prepared ? 'Proposal ready' : scenario.action}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImpactUniverseWorkflow() {
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
              06 · Change intelligence
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Know what a change will touch before it ships.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Flowcordia follows contracts across events, services, stores, and downstream workflows before a proposal can become production.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            proposal #219
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
              Impact simulator
            </div>
            <MorphingDialogTitle className='mt-3 max-w-3xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              See the system before you change it.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Try a contract change, inspect every affected consumer, and prepare the coordinated source updates as one reviewable proposal.
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
            <ImpactExplorer />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
