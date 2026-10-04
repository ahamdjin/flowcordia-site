'use client';

import { motion } from 'motion/react';

export const WORKSPACE_STEPS = [
  {
    key: 'trigger',
    kind: 'Trigger',
    label: 'PR merged',
    source: 'pullRequest.merged',
    detail: 'Starts when an approved pull request reaches main.',
  },
  {
    key: 'build',
    kind: 'Function',
    label: 'Build',
    source: 'build()',
    detail: 'Builds the exact reviewed workflow version.',
  },
  {
    key: 'test',
    kind: 'Function',
    label: 'Test',
    source: 'test()',
    detail: 'Runs release checks before preview promotion.',
  },
  {
    key: 'approval',
    kind: 'Gate',
    label: 'Approval',
    source: 'awaitApproval()',
    detail: 'Waits for the required release reviewer.',
  },
  {
    key: 'deploy',
    kind: 'Function',
    label: 'Deploy',
    source: 'promote()',
    detail: 'Promotes the reviewed preview to production.',
  },
] as const;

export type WorkspaceStep = (typeof WORKSPACE_STEPS)[number]['key'];
export type WorkspaceView = 'source' | 'canvas' | 'diff' | 'terminal';
export type TimeoutValue = '24h' | '2h';

const VIEWS: WorkspaceView[] = ['source', 'canvas', 'diff', 'terminal'];

function sourceLines(timeout: TimeoutValue) {
  return [
    ['export const release = workflow({', null],
    ['  trigger: pullRequest.merged,', 'trigger'],
    ['  steps: [', null],
    ['    build(),', 'build'],
    ['    test(),', 'test'],
    [`    awaitApproval({ timeout: "${timeout}" }),`, 'approval'],
    ['    promote(),', 'deploy'],
    ['  ],', null],
    ['});', null],
  ] as const;
}

export function WorkspaceHeader({
  filename,
  status = 'synced',
}: {
  filename: string;
  status?: string;
}) {
  return (
    <div className='flex h-12 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#111114] px-4 sm:h-14 sm:px-5'>
      <div className='flex min-w-0 items-center gap-4'>
        <div className='flex shrink-0 items-center gap-2' aria-hidden='true'>
          <span className='h-2.5 w-2.5 rounded-full bg-[#ff5f57]' />
          <span className='h-2.5 w-2.5 rounded-full bg-[#febc2e]' />
          <span className='h-2.5 w-2.5 rounded-full bg-[#28c840]' />
        </div>
        <span className='truncate font-mono text-[11px] text-zinc-500 sm:text-xs'>
          {filename}
        </span>
      </div>
      <span className='flex shrink-0 items-center gap-2 font-mono text-[9px] text-zinc-500 sm:text-[10px]'>
        <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
        {status}
      </span>
    </div>
  );
}

export function WorkspaceTabs({
  active,
  status,
  onChange,
}: {
  active: WorkspaceView;
  status: string;
  onChange?: (view: WorkspaceView) => void;
}) {
  return (
    <div className='flex h-12 shrink-0 items-center border-t border-white/[0.08] bg-[#111114] px-2 sm:h-14 sm:px-4'>
      <div className='flex min-w-0 flex-1 self-stretch'>
        {VIEWS.map((view) => {
          const activeView = active === view;
          const className = `relative flex min-w-0 flex-1 items-center justify-center font-mono text-[10px] transition-colors sm:text-[11px] ${
            activeView ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'
          }`;
          const label = (
            <>
              {view}
              {activeView && (
                <motion.span
                  layoutId={onChange ? 'card-one-workspace-tab' : undefined}
                  className='absolute right-3 bottom-0 left-3 h-px bg-zinc-100'
                />
              )}
            </>
          );

          return onChange ? (
            <button
              key={view}
              type='button'
              className={className}
              onClick={() => onChange(view)}
            >
              {label}
            </button>
          ) : (
            <div key={view} className={className}>
              {label}
            </div>
          );
        })}
      </div>
      <span className='hidden min-w-[150px] items-center justify-end gap-2 border-l border-white/[0.08] pl-5 font-mono text-[9px] text-zinc-600 md:flex'>
        <span className='h-1.5 w-1.5 rounded-full bg-[#D9A28D]' />
        {status}
      </span>
    </div>
  );
}

function SourceView({
  timeout,
  selected,
  onSelect,
  revealed = 9,
}: {
  timeout: TimeoutValue;
  selected: WorkspaceStep;
  onSelect?: (step: WorkspaceStep) => void;
  revealed?: number;
}) {
  return (
    <div className='flex h-full items-center justify-center px-4 py-5 sm:px-8'>
      <div className='w-full max-w-[650px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d10] shadow-[0_18px_60px_rgba(0,0,0,0.28)]'>
        <div className='flex h-9 items-center justify-between border-b border-white/[0.06] px-4 font-mono text-[8px] text-zinc-600 sm:text-[9px]'>
          <span>workflow/release.workflow.ts</span>
          <span>TypeScript</span>
        </div>
        <div className='px-3 py-4 font-mono text-[9px] leading-5 sm:px-5 sm:text-[11px] sm:leading-7'>
          {sourceLines(timeout).map(([text, step], index) => {
            const active = step === selected;
            const changed = step === 'approval' && timeout === '2h';
            const row = (
              <>
                <span className='pr-3 text-right text-zinc-800'>{index + 1}</span>
                <span
                  className={`truncate ${
                    changed
                      ? 'text-[#e7b7a5]'
                      : active
                        ? 'text-zinc-100'
                        : 'text-zinc-400'
                  }`}
                >
                  {text}
                </span>
              </>
            );
            const className = `grid w-full grid-cols-[22px_minmax(0,1fr)] rounded px-1 text-left transition-colors ${
              active ? 'bg-white/[0.055]' : ''
            }`;

            if (step && onSelect) {
              return (
                <motion.button
                  key={index}
                  type='button'
                  className={`${className} hover:bg-white/[0.04]`}
                  onClick={() => onSelect(step)}
                  animate={{ opacity: index < revealed ? 1 : 0 }}
                >
                  {row}
                </motion.button>
              );
            }

            return (
              <motion.div
                key={index}
                className={className}
                animate={{ opacity: index < revealed ? 1 : 0 }}
                transition={{ delay: index * 0.025 }}
              >
                {row}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CanvasView({
  timeout,
  selected,
  onSelect,
  visible = 5,
}: {
  timeout: TimeoutValue;
  selected: WorkspaceStep;
  onSelect?: (step: WorkspaceStep) => void;
  visible?: number;
}) {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-5 px-5 py-5 sm:px-8'>
      <div className='flex w-full max-w-[720px] flex-col items-center sm:flex-row'>
        {WORKSPACE_STEPS.map((step, index) => (
          <div key={step.key} className='flex w-full flex-col items-center sm:w-auto sm:flex-row'>
            <motion.button
              type='button'
              disabled={!onSelect}
              onClick={() => onSelect?.(step.key)}
              animate={{ opacity: index < visible ? 1 : 0, scale: index < visible ? 1 : 0.96 }}
              className={`relative w-full rounded-xl border px-3 py-2.5 text-left sm:w-[112px] ${
                selected === step.key
                  ? 'border-[#D9A28D]/70 bg-[#D9A28D]/[0.08]'
                  : 'border-white/[0.09] bg-[#151519]'
              }`}
            >
              <span className='block text-[7px] font-medium tracking-[0.1em] text-zinc-600 uppercase'>
                {step.kind}
              </span>
              <span className='mt-1 block text-[10px] font-medium text-zinc-300 sm:text-[11px]'>
                {step.label}
              </span>
              <span className='mt-1 block truncate font-mono text-[8px] text-zinc-600'>
                {step.key === 'approval' ? timeout : step.source}
              </span>
              {step.key === 'approval' && timeout === '2h' && (
                <span className='absolute -top-1.5 -right-1.5 rounded-full border border-[#D9A28D]/40 bg-[#211916] px-1.5 py-0.5 font-mono text-[7px] text-[#e7b7a5]'>
                  changed
                </span>
              )}
            </motion.button>
            {index < WORKSPACE_STEPS.length - 1 && (
              <span className='h-5 w-px bg-white/[0.09] sm:h-px sm:w-5' />
            )}
          </div>
        ))}
      </div>
      <div className='flex w-full max-w-[720px] items-center justify-between rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2 font-mono text-[8px] text-zinc-600 sm:px-4 sm:text-[9px]'>
        <span className='truncate'>$ flowcordia sync release.workflow.ts</span>
        <span className='flex items-center gap-1.5 text-zinc-500'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />5 nodes
        </span>
      </div>
    </div>
  );
}

function DiffView({ timeout }: { timeout: TimeoutValue }) {
  const changed = timeout === '2h';
  return (
    <div className='flex h-full items-center justify-center px-4 py-5 sm:px-8'>
      <div className='w-full max-w-[650px]'>
        <div className='overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d10]'>
          <div className='flex h-9 items-center justify-between border-b border-white/[0.06] px-4 font-mono text-[8px] text-zinc-600 sm:text-[9px]'>
            <span>Proposal #184</span>
            <span>{changed ? '1 file changed' : 'working tree clean'}</span>
          </div>
          <div className='p-4 font-mono text-[9px] leading-5 sm:p-5 sm:text-[11px] sm:leading-7'>
            {changed ? (
              <>
                <div className='rounded-md bg-red-500/[0.07] px-3 text-red-300/80'>
                  {'- awaitApproval({ timeout: "24h" }),'}
                </div>
                <div className='mt-1 rounded-md bg-emerald-500/[0.07] px-3 text-emerald-300/85'>
                  {'+ awaitApproval({ timeout: "2h" }),'}
                </div>
              </>
            ) : (
              <div className='rounded-md border border-dashed border-white/[0.08] px-3 py-5 text-center text-zinc-600'>
                Change the canvas to generate an exact source diff.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalView({ timeout }: { timeout: TimeoutValue }) {
  const changed = timeout === '2h';
  const lines = [
    '$ flowcordia sync workflow/release.workflow.ts',
    '✓ parsed typed workflow',
    '✓ canvas graph matches 5 source steps',
    changed ? '✓ generated diff: 1 file changed' : '✓ no source changes detected',
    changed ? '→ proposal #184 ready for review' : '→ watching for visual edits',
  ];
  return (
    <div className='flex h-full items-center justify-center px-4 py-5 sm:px-8'>
      <div className='w-full max-w-[650px] overflow-hidden rounded-xl border border-white/[0.08] bg-black'>
        <div className='flex h-9 items-center justify-between border-b border-white/[0.06] px-4 font-mono text-[8px] text-zinc-700 sm:text-[9px]'>
          <span>flowcordia</span><span>zsh</span>
        </div>
        <div className='px-4 py-5 font-mono text-[9px] leading-5 sm:px-5 sm:text-[11px] sm:leading-7'>
          {lines.map((line, index) => (
            <motion.div
              key={`${line}-${timeout}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              className={index === 0 ? 'text-zinc-300' : index === 4 ? 'text-[#dca994]' : 'text-zinc-600'}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkspaceSurface({
  view,
  timeout,
  selected,
  onSelect,
  revealed,
  visible,
}: {
  view: WorkspaceView;
  timeout: TimeoutValue;
  selected: WorkspaceStep;
  onSelect?: (step: WorkspaceStep) => void;
  revealed?: number;
  visible?: number;
}) {
  if (view === 'canvas') {
    return <CanvasView timeout={timeout} selected={selected} onSelect={onSelect} visible={visible} />;
  }
  if (view === 'diff') return <DiffView timeout={timeout} />;
  if (view === 'terminal') return <TerminalView timeout={timeout} />;
  return <SourceView timeout={timeout} selected={selected} onSelect={onSelect} revealed={revealed} />;
}

export function WorkspaceInspector({
  selected,
  timeout,
  onTimeout,
  onReset,
}: {
  selected: WorkspaceStep;
  timeout: TimeoutValue;
  onTimeout: (value: TimeoutValue) => void;
  onReset: () => void;
}) {
  const step = WORKSPACE_STEPS.find((item) => item.key === selected) ?? WORKSPACE_STEPS[0];
  const changed = timeout === '2h';
  return (
    <aside className='border-t border-white/[0.08] bg-[#111114] lg:border-t-0 lg:border-l'>
      <div className='border-b border-white/[0.07] px-5 py-4'>
        <div className='font-mono text-[8px] tracking-[0.12em] text-zinc-700 uppercase'>Inspector</div>
        <div className='mt-2 text-sm font-medium text-zinc-200'>{step.label}</div>
        <p className='mt-2 text-xs leading-5 text-zinc-600'>{step.detail}</p>
      </div>
      <div className='space-y-5 px-5 py-5'>
        <div>
          <div className='font-mono text-[8px] tracking-[0.12em] text-zinc-700 uppercase'>Source</div>
          <div className='mt-2 rounded-lg border border-white/[0.07] bg-black/25 px-3 py-2 font-mono text-[9px] text-zinc-500'>
            {step.source}
          </div>
        </div>
        {selected === 'approval' && (
          <div>
            <div className='font-mono text-[8px] tracking-[0.12em] text-zinc-700 uppercase'>Timeout</div>
            <div className='mt-2 grid grid-cols-2 rounded-lg border border-white/[0.08] bg-black/25 p-1'>
              {(['24h', '2h'] as const).map((value) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => onTimeout(value)}
                  className={`rounded-md px-3 py-2 font-mono text-[10px] ${
                    timeout === value ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className='rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3 text-[10px] text-zinc-600'>
          <div className='flex items-center justify-between font-mono text-[8px]'>
            <span>sync state</span><span className={changed ? 'text-[#dca994]' : ''}>{changed ? '1 change' : 'clean'}</span>
          </div>
          <div className='mt-2 flex items-center gap-2'><span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />canvas and source agree</div>
        </div>
        {changed && (
          <button type='button' onClick={onReset} className='w-full rounded-lg border border-white/[0.09] px-3 py-2 text-xs text-zinc-500 hover:text-zinc-200'>
            Reset change
          </button>
        )}
      </div>
    </aside>
  );
}
