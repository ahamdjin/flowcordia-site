import {
  CheckCircle2,
  Code2,
  GitBranch,
  Play,
  Workflow,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    label: 'Customer created',
    eyebrow: 'Trigger',
    icon: Play,
  },
  {
    label: 'Validate data',
    eyebrow: 'Step',
    icon: CheckCircle2,
  },
  {
    label: 'Configure workspace',
    eyebrow: 'Typed function',
    icon: Code2,
    highlighted: true,
  },
  {
    label: 'Send welcome',
    eyebrow: 'Step',
    icon: Workflow,
  },
];

function StatusDot() {
  return (
    <span
      aria-hidden='true'
      className='h-1.5 w-1.5 rounded-full bg-[#D9A28D]'
    />
  );
}

function PreviewNode({
  step,
  className = '',
}: {
  step: (typeof WORKFLOW_STEPS)[number];
  className?: string;
}) {
  const Icon = step.icon;

  return (
    <div
      className={`relative z-10 min-w-0 rounded-lg border bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(9,9,11,0.04)] dark:bg-zinc-950 ${
        step.highlighted
          ? 'border-[#D9A28D]/60 dark:border-[#D9A28D]/50'
          : 'border-zinc-200 dark:border-zinc-800'
      } ${className}`}
    >
      <div className='flex items-center gap-1.5 text-[8px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
        <Icon className='h-2.5 w-2.5 shrink-0' strokeWidth={1.7} />
        <span className='truncate'>{step.eyebrow}</span>
      </div>
      <div className='mt-1.5 truncate text-[10px] font-medium text-zinc-800 dark:text-zinc-100'>
        {step.label}
      </div>
    </div>
  );
}

export function CustomerOnboardingPreview() {
  return (
    <div className='relative h-48 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950'>
      <div
        aria-hidden='true'
        className='absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(161,161,170,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.14)_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-30'
      />

      <div className='absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white/90 px-2 py-1 text-[9px] font-medium text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400'>
        <StatusDot />
        Production
      </div>

      <div className='absolute top-3 right-3 rounded-md border border-zinc-200 bg-white/90 px-2 py-1 font-mono text-[8px] text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400'>
        a84f2c1
      </div>

      <svg
        aria-hidden='true'
        viewBox='0 0 270 192'
        preserveAspectRatio='none'
        className='absolute inset-0 h-full w-full'
      >
        <path
          d='M78 84 H133 C143 84 143 105 153 105 H192'
          fill='none'
          stroke='currentColor'
          strokeWidth='1'
          className='text-zinc-300 dark:text-zinc-700'
        />
        <path
          d='M192 105 V133 H135 C125 133 125 148 115 148 H78'
          fill='none'
          stroke='currentColor'
          strokeWidth='1'
          className='text-zinc-300 dark:text-zinc-700'
        />
        <circle cx='135' cy='84' r='2' className='fill-zinc-300 dark:fill-zinc-700' />
        <circle cx='192' cy='133' r='2' className='fill-zinc-300 dark:fill-zinc-700' />
      </svg>

      <PreviewNode
        step={WORKFLOW_STEPS[0]}
        className='absolute top-[62px] left-4 w-[94px]'
      />
      <PreviewNode
        step={WORKFLOW_STEPS[1]}
        className='absolute top-[83px] right-4 w-[94px]'
      />
      <PreviewNode
        step={WORKFLOW_STEPS[2]}
        className='absolute right-4 bottom-4 w-[112px]'
      />
      <PreviewNode
        step={WORKFLOW_STEPS[3]}
        className='absolute bottom-4 left-4 w-[94px]'
      />
    </div>
  );
}

function ExpandedNode({
  step,
  index,
}: {
  step: (typeof WORKFLOW_STEPS)[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <div className='relative flex min-w-0 flex-1 items-center'>
      <div
        className={`relative z-10 w-full rounded-xl border bg-white p-3.5 dark:bg-zinc-950 ${
          step.highlighted
            ? 'border-[#D9A28D]/60 dark:border-[#D9A28D]/50'
            : 'border-zinc-200 dark:border-zinc-800'
        }`}
      >
        <div className='flex items-center gap-2'>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
              step.highlighted
                ? 'bg-[#D9A28D]/15 text-[#A86550] dark:text-[#E4B8A7]'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
            }`}
          >
            <Icon className='h-3.5 w-3.5' strokeWidth={1.7} />
          </span>
          <div className='min-w-0'>
            <div className='truncate text-[9px] font-medium tracking-[0.08em] text-zinc-400 uppercase dark:text-zinc-500'>
              {step.eyebrow}
            </div>
            <div className='mt-0.5 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100'>
              {step.label}
            </div>
          </div>
        </div>
      </div>

      {index < WORKFLOW_STEPS.length - 1 && (
        <div aria-hidden='true' className='flex w-5 shrink-0 items-center'>
          <span className='h-px w-full bg-zinc-300 dark:bg-zinc-700' />
          <span className='-ml-1 h-1.5 w-1.5 rotate-45 border-t border-r border-zinc-300 dark:border-zinc-700' />
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='min-w-0 border-t border-zinc-100 pt-3 first:border-t-0 first:pt-0 dark:border-zinc-800'>
      <dt className='text-[10px] font-medium tracking-[0.06em] text-zinc-400 uppercase dark:text-zinc-500'>
        {label}
      </dt>
      <dd className='mt-1.5 min-w-0 text-sm font-medium text-zinc-800 dark:text-zinc-100'>
        {children}
      </dd>
    </div>
  );
}

export function CustomerOnboardingDetails() {
  return (
    <div>
      <div className='relative overflow-hidden border-y border-zinc-100 bg-zinc-50 px-6 py-7 dark:border-zinc-800 dark:bg-zinc-950'>
        <div
          aria-hidden='true'
          className='absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(161,161,170,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.12)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-25'
        />
        <div className='relative flex items-center'>
          {WORKFLOW_STEPS.map((step, index) => (
            <ExpandedNode key={step.label} step={step} index={index} />
          ))}
        </div>
      </div>

      <div className='grid gap-7 p-6 sm:grid-cols-[1.15fr_0.85fr]'>
        <div>
          <div className='flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400'>
            <GitBranch className='h-3.5 w-3.5' strokeWidth={1.7} />
            Versioned workflow
          </div>
          <p className='mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
            Creates the customer workspace, provisions its default resources,
            and sends the first welcome notification from one reviewed version.
          </p>

          <div className='mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950'>
            <div className='text-[10px] font-medium tracking-[0.06em] text-zinc-400 uppercase dark:text-zinc-500'>
              Typed function
            </div>
            <code className='mt-2 block font-mono text-xs text-zinc-800 dark:text-zinc-200'>
              configureWorkspace(customer)
            </code>
            <div className='mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400'>
              <CheckCircle2 className='h-3.5 w-3.5' strokeWidth={1.7} />
              Inputs and outputs validated
            </div>
          </div>
        </div>

        <dl className='space-y-3'>
          <Detail label='Repository'>
            <code className='font-mono text-xs'>acme/operations</code>
          </Detail>
          <Detail label='Current deployment'>
            <span className='inline-flex items-center gap-2'>
              <StatusDot />
              Production · <code className='font-mono text-xs'>a84f2c1</code>
            </span>
          </Detail>
          <Detail label='Last successful run'>
            <span className='inline-flex items-center gap-2'>
              <CheckCircle2 className='h-3.5 w-3.5 text-zinc-400' strokeWidth={1.7} />
              Completed · 42s ago
            </span>
          </Detail>
        </dl>
      </div>
    </div>
  );
}
