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

type FunctionKey = 'browser' | 'billing' | 'risk';

type FunctionSpec = {
  key: FunctionKey;
  label: string;
  file: string;
  packageName: string;
  runtime: string;
  description: string;
  nodeLabel: string;
  code: string[];
  inputs: Array<{ name: string; type: string }>;
  outputs: Array<{ name: string; type: string }>;
  permissions: string[];
};

const FUNCTIONS: Record<FunctionKey, FunctionSpec> = {
  browser: {
    key: 'browser',
    label: 'Browser check',
    file: 'functions/browser-check.ts',
    packageName: 'playwright',
    runtime: 'Node 22 · 1 GB',
    description:
      'Run a real browser library and expose only the typed contract the workflow needs.',
    nodeLabel: 'Inspect website',
    code: [
      "import { chromium } from 'playwright';",
      'export const browserCheck = defineFunction({',
      '  input: z.object({ url: z.string().url() }),',
      '  run: async ({ url }) => inspect(chromium, url),',
      '});',
    ],
    inputs: [{ name: 'url', type: 'string · URL' }],
    outputs: [
      { name: 'status', type: "'healthy' | 'degraded'" },
      { name: 'screenshotUrl', type: 'string' },
    ],
    permissions: ['network: outbound', 'browser: chromium'],
  },
  billing: {
    key: 'billing',
    label: 'Charge invoice',
    file: 'functions/charge-invoice.ts',
    packageName: 'stripe',
    runtime: 'Node 22 · 512 MB',
    description:
      'Keep the official SDK and its error handling while giving the canvas a safe typed surface.',
    nodeLabel: 'Charge invoice',
    code: [
      "import Stripe from 'stripe';",
      'export const chargeInvoice = defineFunction({',
      '  input: invoiceContract,',
      '  run: async ({ invoiceId }) => stripe.invoices.pay(invoiceId),',
      '});',
    ],
    inputs: [{ name: 'invoiceId', type: 'string' }],
    outputs: [
      { name: 'paymentId', type: 'string' },
      { name: 'paid', type: 'boolean' },
    ],
    permissions: ['secret: STRIPE_KEY', 'network: api.stripe.com'],
  },
  risk: {
    key: 'risk',
    label: 'Internal risk score',
    file: 'functions/risk-score.ts',
    packageName: '@acme/risk-engine',
    runtime: 'Private worker · Node 22',
    description:
      'Use a private package inside your own worker and publish a governed node without exposing its implementation.',
    nodeLabel: 'Score account risk',
    code: [
      "import { scoreAccount } from '@acme/risk-engine';",
      'export const riskScore = defineFunction({',
      '  input: z.object({ accountId: z.string() }),',
      '  run: ({ accountId }) => scoreAccount(accountId),',
      '});',
    ],
    inputs: [{ name: 'accountId', type: 'string' }],
    outputs: [
      { name: 'score', type: 'number · 0–100' },
      { name: 'review', type: 'boolean' },
    ],
    permissions: ['package: private registry', 'network: internal only'],
  },
};

const FUNCTION_KEYS = Object.keys(FUNCTIONS) as FunctionKey[];

function DraftMarks() {
  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
      <div className='absolute top-1/2 right-0 left-0 border-t border-zinc-200/80 dark:border-zinc-800/80' />
      <div className='absolute top-0 bottom-0 left-1/2 border-l border-zinc-200/80 dark:border-zinc-800/80' />
      <div className='absolute top-7 left-7 h-3 w-3 border-t border-l border-zinc-300 dark:border-zinc-700' />
      <div className='absolute top-7 right-7 h-3 w-3 border-t border-r border-zinc-300 dark:border-zinc-700' />
      <div className='absolute bottom-7 left-7 h-3 w-3 border-b border-l border-zinc-300 dark:border-zinc-700' />
      <div className='absolute right-7 bottom-7 h-3 w-3 border-r border-b border-zinc-300 dark:border-zinc-700' />
      <div className='absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.12em] text-zinc-300 uppercase dark:text-zinc-700'>
        Function assembly surface
      </div>
    </div>
  );
}

function SourceLayer({ spec }: { spec: FunctionSpec }) {
  return (
    <div className='h-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-[0_18px_50px_rgba(9,9,11,0.20)]'>
      <div className='flex items-center justify-between gap-3 border-b border-zinc-800 pb-3'>
        <span className='truncate font-mono text-[9px] text-zinc-400'>{spec.file}</span>
        <span className='rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-[8px] text-zinc-500'>
          source
        </span>
      </div>
      <div className='mt-3 space-y-1.5 overflow-hidden font-mono text-[9px] leading-4 text-zinc-300'>
        {spec.code.map((line, index) => (
          <div key={`${line}-${index}`} className='flex gap-3 whitespace-nowrap'>
            <span className='w-3 shrink-0 text-right text-zinc-700'>{index + 1}</span>
            <span className={index === 0 ? 'text-[#e0ae99]' : undefined}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContractLayer({
  label,
  rows,
}: {
  label: string;
  rows: Array<{ name: string; type: string }>;
}) {
  return (
    <div className='h-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_45px_rgba(9,9,11,0.08)] dark:border-zinc-700 dark:bg-zinc-900'>
      <div className='flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800'>
        <span className='text-[9px] font-medium tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-500'>
          {label}
        </span>
        <span className='font-mono text-[8px] text-zinc-400 dark:text-zinc-500'>typed</span>
      </div>
      <div className='mt-3 space-y-2'>
        {rows.map((row) => (
          <div
            key={row.name}
            className='flex items-center justify-between gap-4 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950'
          >
            <span className='font-mono text-[9px] font-medium text-zinc-800 dark:text-zinc-200'>
              {row.name}
            </span>
            <span className='truncate font-mono text-[8px] text-zinc-400 dark:text-zinc-500'>
              {row.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuntimeLayer({ spec }: { spec: FunctionSpec }) {
  return (
    <div className='h-full rounded-2xl border border-[#D9A28D]/45 bg-[#fffaf7] p-4 shadow-[0_18px_45px_rgba(155,103,85,0.10)] dark:bg-[#211a17]'>
      <div className='flex items-center justify-between border-b border-[#D9A28D]/30 pb-3'>
        <span className='text-[9px] font-medium tracking-[0.1em] text-[#9b6755] uppercase dark:text-[#e0ae99]'>
          Runtime envelope
        </span>
        <span className='font-mono text-[8px] text-[#b6816d]'>{spec.runtime}</span>
      </div>
      <div className='mt-3 space-y-2'>
        <div className='rounded-lg border border-[#D9A28D]/30 bg-white/70 px-3 py-2 dark:bg-zinc-950/30'>
          <div className='text-[8px] tracking-[0.08em] text-[#b6816d] uppercase'>Package</div>
          <div className='mt-1 font-mono text-[9px] text-[#7f5141] dark:text-[#e0ae99]'>
            {spec.packageName}
          </div>
        </div>
        {spec.permissions.map((permission) => (
          <div
            key={permission}
            className='rounded-lg border border-[#D9A28D]/30 bg-white/70 px-3 py-2 font-mono text-[8px] text-[#7f5141] dark:bg-zinc-950/30 dark:text-[#e0ae99]'
          >
            {permission}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompiledNode({ spec }: { spec: FunctionSpec }) {
  return (
    <div className='relative h-[190px] w-[270px] rounded-[26px] border border-zinc-300 bg-white p-5 shadow-[0_28px_70px_rgba(9,9,11,0.16)] dark:border-zinc-700 dark:bg-zinc-900'>
      <div className='absolute top-1/2 -left-2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-white bg-[#D9A28D] shadow-sm dark:border-zinc-900' />
      <div className='absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-white bg-zinc-900 shadow-sm dark:border-zinc-900 dark:bg-zinc-100' />
      <div className='flex items-start justify-between gap-4'>
        <div>
          <div className='text-[8px] font-medium tracking-[0.11em] text-zinc-400 uppercase dark:text-zinc-500'>
            Generated function node
          </div>
          <div className='mt-2 text-base font-medium text-zinc-950 dark:text-zinc-50'>
            {spec.nodeLabel}
          </div>
        </div>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400'>
          fn
        </div>
      </div>
      <p className='mt-3 line-clamp-2 text-[10px] leading-4 text-zinc-500 dark:text-zinc-400'>
        {spec.description}
      </p>
      <div className='mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-800'>
        <span className='font-mono text-[8px] text-zinc-400 dark:text-zinc-500'>
          {spec.inputs.length} input · {spec.outputs.length} outputs
        </span>
        <span className='rounded-full bg-[#D9A28D]/15 px-2 py-1 font-mono text-[8px] text-[#9b6755] dark:text-[#e0ae99]'>
          contract valid
        </span>
      </div>
    </div>
  );
}

function FunctionAssembly({
  spec,
  phase,
  assembled,
}: {
  spec: FunctionSpec;
  phase?: number;
  assembled: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const visibleCount = phase === undefined ? 4 : phase === 0 ? 1 : 4;
  const explodedPositions = [
    { x: -92, y: -72, rotate: -6 },
    { x: 96, y: -64, rotate: 5 },
    { x: -86, y: 78, rotate: 4 },
    { x: 94, y: 72, rotate: -5 },
  ];

  const layers = [
    <SourceLayer key='source' spec={spec} />,
    <ContractLayer key='input' label='Input contract' rows={spec.inputs} />,
    <ContractLayer key='output' label='Output contract' rows={spec.outputs} />,
    <RuntimeLayer key='runtime' spec={spec} />,
  ];

  return (
    <div className='relative h-full min-h-[430px] w-full overflow-hidden bg-[#f7f6f2] dark:bg-zinc-950'>
      <DraftMarks />

      <div className='absolute inset-0 flex items-center justify-center [perspective:1200px]'>
        {layers.map((layer, index) => {
          const position = explodedPositions[index];
          const visible = index < visibleCount;
          return (
            <div
              key={index}
              className='absolute top-1/2 left-1/2 h-[175px] w-[235px] -translate-x-1/2 -translate-y-1/2 sm:h-[190px] sm:w-[270px]'
            >
              <motion.div
                className='h-full w-full'
                initial={false}
                animate={
                  assembled
                    ? {
                        x: 0,
                        y: index * 3,
                        rotate: -1 + index * 0.65,
                        scale: 0.95 - index * 0.015,
                        opacity: 0.12,
                      }
                    : {
                        x: visible ? position.x : 0,
                        y: visible ? position.y : 0,
                        rotate: visible ? position.rotate : 0,
                        scale: visible ? 0.88 : 0.72,
                        opacity: visible ? 1 : 0,
                      }
                }
                transition={{
                  type: reduceMotion ? 'tween' : 'spring',
                  bounce: 0.08,
                  duration: reduceMotion ? 0 : 0.62,
                  delay: assembled ? index * 0.035 : index * 0.06,
                }}
              >
                {layer}
              </motion.div>
            </div>
          );
        })}

        <AnimatePresence>
          {assembled && (
            <motion.div
              className='relative z-20'
              initial={{ opacity: 0, scale: 0.72, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.78, rotate: 3 }}
              transition={{ type: 'spring', bounce: 0.12, duration: 0.55 }}
            >
              <CompiledNode spec={spec} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 2 && !assembled && (
            <motion.div
              className='absolute z-30 h-[330px] w-[2px] bg-gradient-to-b from-transparent via-[#D9A28D] to-transparent shadow-[0_0_22px_rgba(217,162,141,0.75)]'
              initial={{ x: -210, opacity: 0 }}
              animate={{ x: 210, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className='absolute right-6 bottom-5 left-6 flex items-center justify-between gap-5 font-mono text-[8px] text-zinc-400 sm:right-8 sm:left-8 dark:text-zinc-600'>
        <span>{spec.file}</span>
        <span>source remains authoritative</span>
      </div>
    </div>
  );
}

function ClosedPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) {
      setPhase(0);
      return;
    }
    if (reduceMotion) {
      setPhase(4);
      return;
    }

    let timers: number[] = [];
    const cycle = () => {
      setPhase(0);
      timers = [
        window.setTimeout(() => setPhase(1), 900),
        window.setTimeout(() => setPhase(2), 2200),
        window.setTimeout(() => setPhase(3), 3600),
        window.setTimeout(() => setPhase(4), 5000),
        window.setTimeout(cycle, 7600),
      ];
    };
    cycle();
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView, reduceMotion]);

  const status =
    phase === 0
      ? ['Source discovered', 'playwright imported']
      : phase === 1
        ? ['Contract extracted', 'inputs · outputs · runtime']
        : phase === 2
          ? ['Validating function', 'types and permissions checked']
          : phase === 3
            ? ['Native node generated', 'implementation unchanged']
            : ['Ready in Studio', 'source and node remain connected'];

  return (
    <div ref={ref} className='flex min-h-0 flex-1 flex-col'>
      <div className='min-h-0 flex-1'>
        <FunctionAssembly spec={FUNCTIONS.browser} phase={phase} assembled={phase >= 3} />
      </div>
      <div className='flex items-end justify-between gap-6 border-t border-zinc-200 px-7 py-5 sm:px-10 dark:border-zinc-800'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>{status[0]}</div>
            <div className='mt-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500'>{status[1]}</div>
          </motion.div>
        </AnimatePresence>
        <span className='shrink-0 text-xs text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200'>
          Open workbench →
        </span>
      </div>
    </div>
  );
}

function Workbench() {
  const [selected, setSelected] = useState<FunctionKey>('browser');
  const [assembled, setAssembled] = useState(false);
  const spec = FUNCTIONS[selected];

  const choose = (key: FunctionKey) => {
    setSelected(key);
    setAssembled(false);
  };

  return (
    <div>
      <div className='relative h-[570px] overflow-hidden border-y border-zinc-200 dark:border-zinc-800 sm:h-[590px]'>
        <FunctionAssembly spec={spec} assembled={assembled} />

        <div className='absolute top-5 right-5 z-40 flex rounded-full border border-zinc-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90'>
          <button
            type='button'
            onClick={() => setAssembled(false)}
            className={`rounded-full px-3 py-1.5 text-[9px] font-medium transition-colors ${
              !assembled
                ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'
                : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
            }`}
          >
            Exploded
          </button>
          <button
            type='button'
            onClick={() => setAssembled(true)}
            className={`rounded-full px-3 py-1.5 text-[9px] font-medium transition-colors ${
              assembled
                ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'
                : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50'
            }`}
          >
            Compiled node
          </button>
        </div>

        <div className='absolute top-5 left-5 z-40 max-w-[240px] rounded-xl border border-zinc-200 bg-white/90 px-3.5 py-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90'>
          <div className='text-[8px] font-medium tracking-[0.1em] text-zinc-400 uppercase dark:text-zinc-500'>
            Active package
          </div>
          <div className='mt-1.5 font-mono text-[10px] text-zinc-950 dark:text-zinc-50'>
            {spec.packageName}
          </div>
          <div className='mt-1 text-[9px] text-zinc-400 dark:text-zinc-500'>{spec.runtime}</div>
        </div>
      </div>

      <div className='px-6 py-6 sm:px-9 sm:py-8'>
        <div className='grid gap-2 sm:grid-cols-3'>
          {FUNCTION_KEYS.map((key) => {
            const item = FUNCTIONS[key];
            const active = key === selected;
            return (
              <button
                key={key}
                type='button'
                onClick={() => choose(key)}
                className={`rounded-xl border px-4 py-3.5 text-left transition-colors ${
                  active
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <span className={`block text-[8px] tracking-[0.09em] uppercase ${active ? 'text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {item.packageName}
                </span>
                <span className='mt-1.5 block text-xs font-medium'>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className='mt-6 flex flex-col gap-5 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800'>
          <div className='max-w-xl'>
            <div className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              {assembled ? `${spec.nodeLabel} is ready for the canvas` : 'Inspect the generated surfaces'}
            </div>
            <div className='mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
              {assembled
                ? `Flowcordia generated the node, input form, output mapping, and runtime envelope from ${spec.file}.`
                : spec.description}
            </div>
          </div>
          <button
            type='button'
            onClick={() => setAssembled((current) => !current)}
            className='shrink-0 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-80 dark:bg-zinc-50 dark:text-zinc-950'
          >
            {assembled ? 'Separate layers' : 'Compile function node'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FunctionWorkbench() {
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
              07 · Function compiler
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Your functions become native building blocks.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Use Playwright, SDKs, and private packages. Flowcordia extracts the typed contract without replacing the source.
            </MorphingDialogSubtitle>
          </div>
          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            browser-check.ts
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
              Function workbench
            </div>
            <MorphingDialogTitle className='mt-3 max-w-3xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Bring the code you already trust.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Inspect how Flowcordia turns real TypeScript into a typed visual primitive while preserving its packages, runtime, permissions, and Git history.
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
            <Workbench />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
