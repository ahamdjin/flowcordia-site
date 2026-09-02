'use client';

import { motion } from 'motion/react';
import {
  Check,
  CircleDot,
  Code2,
  GitBranch,
  GitCommitHorizontal,
  RotateCcw,
  Server,
  Workflow,
} from 'lucide-react';

function ProductFrame({
  title,
  status,
  children,
  className = '',
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_22px_70px_-36px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
    >
      <div className='flex h-11 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800'>
        <div className='flex items-center gap-3'>
          <div className='flex gap-1.5' aria-hidden='true'>
            <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
            <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
            <span className='h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700' />
          </div>
          <span className='font-mono text-[11px] text-zinc-500 dark:text-zinc-400'>
            {title}
          </span>
        </div>
        {status ? (
          <div className='flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            {status}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function WorkflowNode({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.div
      animate={
        active
          ? {
              borderColor: [
                'rgba(161,161,170,0.35)',
                'rgba(16,185,129,0.8)',
                'rgba(161,161,170,0.35)',
              ],
              boxShadow: [
                '0 0 0 0 rgba(16,185,129,0)',
                '0 0 0 4px rgba(16,185,129,0.08)',
                '0 0 0 0 rgba(16,185,129,0)',
              ],
            }
          : undefined
      }
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className='relative flex min-h-11 items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'
    >
      <span>{children}</span>
      <span className='h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600' />
    </motion.div>
  );
}

function Connector() {
  return (
    <div className='flex h-5 items-center justify-center' aria-hidden='true'>
      <div className='h-full w-px bg-zinc-200 dark:bg-zinc-800' />
    </div>
  );
}

export function HeroWorkflowVisual() {
  return (
    <ProductFrame title='customer-onboarding.ts' status='running'>
      <div className='grid min-h-[410px] md:grid-cols-[0.88fr_1.12fr]'>
        <div className='border-b border-zinc-200 bg-zinc-950 p-5 md:border-r md:border-b-0 dark:border-zinc-800'>
          <div className='mb-5 flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase'>
            <Code2 className='h-3.5 w-3.5' />
            source
          </div>
          <div className='space-y-1.5 font-mono text-[11px] leading-6 text-zinc-500'>
            <div>
              <span className='text-violet-300'>export const</span>{' '}
              <span className='text-zinc-100'>onboarding</span>{' '}
              <span className='text-zinc-500'>= workflow(async () =&gt; {'{'}</span>
            </div>
            <div className='pl-4'>
              <span className='text-sky-300'>await</span>{' '}
              <span className='text-zinc-200'>validateCustomer()</span>
            </div>
            <div className='pl-4'>
              <span className='text-sky-300'>await</span>{' '}
              <span className='text-zinc-200'>createAccount()</span>
            </div>
            <motion.div
              animate={{
                backgroundColor: [
                  'rgba(24,24,27,0)',
                  'rgba(16,185,129,0.10)',
                  'rgba(24,24,27,0)',
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className='-mx-2 rounded-md px-2 pl-6'
            >
              <span className='text-sky-300'>await</span>{' '}
              <span className='text-emerald-300'>waitForApproval()</span>
            </motion.div>
            <div className='pl-4'>
              <span className='text-sky-300'>await</span>{' '}
              <span className='text-zinc-200'>sendWelcome()</span>
            </div>
            <div className='text-zinc-500'>{'});'}</div>
          </div>
        </div>

        <div className='bg-zinc-50 p-5 dark:bg-zinc-900/40'>
          <div className='mb-5 flex items-center justify-between'>
            <div className='flex items-center gap-2 text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase'>
              <Workflow className='h-3.5 w-3.5' />
              workflow
            </div>
            <span className='font-mono text-[10px] text-zinc-400'>run #1284</span>
          </div>
          <div className='mx-auto max-w-[245px]'>
            <WorkflowNode>Validate customer</WorkflowNode>
            <Connector />
            <WorkflowNode>Create account</WorkflowNode>
            <Connector />
            <WorkflowNode active>Wait for approval</WorkflowNode>
            <Connector />
            <WorkflowNode>Send welcome</WorkflowNode>
          </div>
        </div>
      </div>
      <div className='grid gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-[10px] text-zinc-500 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400'>
        <div className='flex items-center gap-2 font-mono'>
          <GitCommitHorizontal className='h-3.5 w-3.5' /> commit 8fa23c
        </div>
        <div className='flex items-center gap-2 font-mono sm:justify-center'>
          <CircleDot className='h-3.5 w-3.5' /> 3 / 4 steps
        </div>
        <div className='flex items-center gap-2 font-mono sm:justify-end'>
          <span className='h-1.5 w-1.5 rounded-full bg-amber-400' /> waiting
        </div>
      </div>
    </ProductFrame>
  );
}

export function CodeCanvasVisual() {
  return (
    <ProductFrame title='onboarding.workflow.ts' status='synced'>
      <div className='grid min-h-[360px] lg:grid-cols-2'>
        <div className='relative overflow-hidden border-b border-zinc-200 bg-zinc-950 p-6 lg:border-r lg:border-b-0 dark:border-zinc-800'>
          <div className='mb-6 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>
            <Code2 className='h-3.5 w-3.5' /> code
          </div>
          <div className='font-mono text-[11px] leading-7'>
            <div className='text-zinc-500'>export const onboarding = workflow(async () =&gt; {'{'}</div>
            <div className='pl-5 text-zinc-300'>await validateCustomer()</div>
            <div className='pl-5 text-zinc-300'>await createAccount()</div>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className='-mx-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 pl-7 text-emerald-300'
            >
              await waitForApproval()
            </motion.div>
            <div className='pl-5 text-zinc-300'>await sendWelcome()</div>
            <div className='text-zinc-500'>{'});'}</div>
          </div>
          <div className='absolute right-6 bottom-5 font-mono text-[10px] text-zinc-600'>
            source of truth
          </div>
        </div>

        <div className='relative bg-white p-6 dark:bg-zinc-900/40'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>
              <Workflow className='h-3.5 w-3.5' /> canvas
            </div>
            <span className='font-mono text-[10px] text-emerald-600 dark:text-emerald-400'>
              4 steps matched
            </span>
          </div>
          <div className='mx-auto max-w-[230px]'>
            <WorkflowNode>Validate customer</WorkflowNode>
            <Connector />
            <WorkflowNode>Create account</WorkflowNode>
            <Connector />
            <WorkflowNode active>Wait for approval</WorkflowNode>
            <Connector />
            <WorkflowNode>Send welcome</WorkflowNode>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-2 border-t border-zinc-200 px-4 py-3 font-mono text-[10px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
        <GitBranch className='h-3.5 w-3.5' /> one workflow · two views · no duplicated logic
      </div>
    </ProductFrame>
  );
}

function RunStep({
  label,
  state,
}: {
  label: string;
  state: 'done' | 'retrying' | 'queued';
}) {
  return (
    <div className='grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-zinc-100 px-4 py-3.5 last:border-b-0 dark:border-zinc-800/80'>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          state === 'done'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : state === 'retrying'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
        }`}
      >
        {state === 'done' ? (
          <Check className='h-3.5 w-3.5' />
        ) : state === 'retrying' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
          >
            <RotateCcw className='h-3.5 w-3.5' />
          </motion.div>
        ) : (
          <span className='h-1.5 w-1.5 rounded-full bg-current' />
        )}
      </div>
      <span className='text-sm font-medium text-zinc-800 dark:text-zinc-100'>{label}</span>
      <span className='font-mono text-[10px] text-zinc-400'>
        {state === 'done' ? 'completed' : state === 'retrying' ? 'attempt 2 / 3' : 'queued'}
      </span>
    </div>
  );
}

export function DurableExecutionVisual() {
  return (
    <ProductFrame title='run / video-processing / #8291' status='live'>
      <div className='grid min-h-[390px] md:grid-cols-[1.15fr_0.85fr]'>
        <div className='border-b border-zinc-200 md:border-r md:border-b-0 dark:border-zinc-800'>
          <RunStep label='Upload video' state='done' />
          <RunStep label='Extract audio' state='done' />
          <RunStep label='Generate thumbnails' state='done' />
          <RunStep label='Transcribe audio' state='retrying' />
          <RunStep label='Create subtitles' state='queued' />
          <RunStep label='Publish results' state='queued' />
        </div>

        <div className='bg-zinc-50 p-5 dark:bg-zinc-900/40'>
          <div className='mb-5 font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>
            active step
          </div>
          <div className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                  Transcribe audio
                </div>
                <div className='mt-1 font-mono text-[10px] text-zinc-400'>step_04</div>
              </div>
              <span className='rounded-full bg-amber-500/10 px-2 py-1 font-mono text-[10px] text-amber-700 dark:text-amber-300'>
                retrying
              </span>
            </div>
            <div className='mt-5 rounded-lg bg-zinc-950 p-3 font-mono text-[10px] leading-5 text-zinc-400'>
              <div className='text-zinc-500'>$ worker retry step_04</div>
              <div className='mt-1 text-rose-300'>request timed out after 30s</div>
              <motion.div
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className='mt-1 text-amber-300'
              >
                retrying from checkpoint...
              </motion.div>
            </div>
          </div>
          <div className='mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4'>
            <div className='flex gap-3'>
              <Check className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
              <div>
                <div className='text-xs font-medium text-zinc-800 dark:text-zinc-100'>
                  Completed work is preserved
                </div>
                <p className='mt-1 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400'>
                  Steps 1–3 stay complete while only the failed work is retried.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductFrame>
  );
}

function ArchitectureBox({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950'>
      <div className='flex items-start gap-3'>
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
          {icon}
        </div>
        <div>
          <div className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>{title}</div>
          <div className='mt-1 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400'>{detail}</div>
        </div>
      </div>
    </div>
  );
}

export function ArchitectureVisual() {
  return (
    <ProductFrame title='deployment / self-hosted'>
      <div className='bg-zinc-50 p-5 sm:p-7 dark:bg-zinc-900/40'>
        <div className='mx-auto max-w-2xl'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <ArchitectureBox
              icon={<GitBranch className='h-4 w-4' />}
              title='Your Git repository'
              detail='Workflow source, reviews, versions, and application logic stay with your code.'
            />
            <ArchitectureBox
              icon={<Workflow className='h-4 w-4' />}
              title='Flowcordia control plane'
              detail='Coordinates workflow definitions, runs, state, approvals, and visibility.'
            />
          </div>

          <div className='my-3 flex justify-center' aria-hidden='true'>
            <div className='h-8 w-px bg-zinc-300 dark:bg-zinc-700' />
          </div>

          <div className='rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-950'>
            <div className='font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>
              queue · scheduler · durable state
            </div>
          </div>

          <div className='my-3 flex justify-center' aria-hidden='true'>
            <div className='h-8 w-px bg-zinc-300 dark:bg-zinc-700' />
          </div>

          <div className='grid gap-3 sm:grid-cols-3'>
            {['Worker 01', 'Worker 02', 'Worker 03'].map((worker, index) => (
              <motion.div
                key={worker}
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.25,
                  ease: 'easeInOut',
                }}
                className='rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950'
              >
                <Server className='mx-auto h-4 w-4 text-zinc-500' />
                <div className='mt-2 text-xs font-medium text-zinc-800 dark:text-zinc-100'>{worker}</div>
                <div className='mt-1 font-mono text-[9px] text-zinc-400'>your infrastructure</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className='grid gap-3 border-t border-zinc-200 px-4 py-3 sm:grid-cols-3 dark:border-zinc-800'>
        {['Self-hostable', 'Open source', 'No workflow lock-in'].map((item) => (
          <div key={item} className='flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400'>
            <Check className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
            {item}
          </div>
        ))}
      </div>
    </ProductFrame>
  );
}
