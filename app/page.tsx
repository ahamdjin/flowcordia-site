import Link from 'next/link';
import React from 'react';
import {
  Check,
  ChevronRight,
  Eye,
  GitBranch,
  RotateCcw,
  Terminal,
  UserCheck,
} from 'lucide-react';
import XIcon from '@/components/website/icons/x';
import GitHubIcon from '@/components/website/icons/github';
import ThemeSwitch from '@/components/website/theme-switch';
import { FlowcordiaLogo } from '@/components/website/flowcordia-logo';
import { SiteFooter } from '@/components/website/site-footer';
import {
  ArchitectureVisual,
  CodeCanvasVisual,
  DurableExecutionVisual,
  HeroWorkflowVisual,
} from '@/components/website/flowcordia-home-visuals';

function Button({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const buttonVariants = {
    primary:
      'border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300',
    secondary:
      'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900',
  };

  return (
    <span
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${buttonVariants[variant]}`}
    >
      {children}
    </span>
  );
}

function Header() {
  return (
    <header className='relative top-0 z-10 bg-white px-6 py-5 lg:flex lg:h-16 lg:items-center lg:px-8 lg:py-0 dark:border-white/10 dark:bg-zinc-950'>
      <div className='mx-auto flex w-full items-center justify-between md:max-w-7xl'>
        <a href='/' className='relative flex items-center space-x-2'>
          <FlowcordiaLogo className='h-6 w-auto' />
          <div className='text-sm font-medium text-zinc-950 dark:text-white'>
            Flowcordia
          </div>
          <span className='mb-4 ml-0 rounded-sm bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-50 select-none'>
            alpha
          </span>
        </a>

        <div className='flex items-center space-x-6'>
          <nav className='hidden items-center space-x-6 sm:flex'>
            <a
              href='#product'
              className='hidden items-center text-sm font-medium text-zinc-700 hover:text-zinc-950 md:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Product
            </a>
            <a
              href='https://github.com/ahamdjin/Flowcordia/issues'
              target='_blank'
              rel='noopener noreferrer'
              className='hidden items-center text-sm font-medium text-zinc-700 hover:text-zinc-950 md:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Roadmap
            </a>
            <Link
              href='/docs'
              className='text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
            >
              Docs
            </Link>
          </nav>
          <div className='hidden h-8 w-px bg-zinc-200 sm:flex dark:bg-zinc-800' />
          <nav className='flex items-center space-x-2'>
            <a
              href='https://github.com/ahamdjin/Flowcordia/discussions'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Flowcordia community discussions'
              className='inline-flex h-9 w-9 items-center justify-center'
            >
              <XIcon className='h-4 w-4 fill-zinc-950 dark:fill-white' />
            </a>
            <a
              href='https://github.com/ahamdjin/Flowcordia'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Flowcordia on GitHub'
              className='inline-flex h-9 w-9 items-center justify-center'
            >
              <GitHubIcon className='h-4 w-4 fill-zinc-950 dark:fill-white' />
            </a>
            <ThemeSwitch />
          </nav>
        </div>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-4 font-mono text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400'>
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`max-w-2xl ${
        align === 'center' ? 'mx-auto text-center' : ''
      }`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className='text-3xl font-medium tracking-[-0.035em] text-zinc-950 sm:text-4xl dark:text-zinc-50'>
        {title}
      </h2>
      {description ? (
        <p className='mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-300'>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Capability({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='border-t border-zinc-200 pt-5 dark:border-zinc-800'>
      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300'>
        {icon}
      </div>
      <h3 className='mt-4 text-sm font-medium text-zinc-950 dark:text-zinc-50'>{title}</h3>
      <p className='mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className='px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 lg:px-8'>
          <div className='mx-auto max-w-7xl'>
            <div className='mx-auto max-w-3xl text-center'>
              <Eyebrow>Open-source workflow infrastructure</Eyebrow>
              <h1 className='text-4xl font-medium tracking-[-0.045em] text-zinc-950 sm:text-6xl dark:text-zinc-50'>
                Build in code. Operate visually.
              </h1>
              <p className='mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300'>
                Flowcordia is an open-source platform for building durable workflows in real code, while giving your team a visual way to understand, monitor, and operate them.
              </p>
              <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
                <a
                  href='https://github.com/ahamdjin/Flowcordia'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button>
                    <GitHubIcon className='mr-2 h-4 w-4 fill-current' />
                    View on GitHub
                  </Button>
                </a>
                <Link href='/docs'>
                  <Button variant='secondary'>
                    Read the docs
                    <ChevronRight className='ml-1.5 h-4 w-4' />
                  </Button>
                </Link>
              </div>
              <div className='mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400'>
                <span>Open source</span>
                <span className='text-zinc-300 dark:text-zinc-700'>·</span>
                <span>Self-hostable</span>
                <span className='text-zinc-300 dark:text-zinc-700'>·</span>
                <span>Git-native</span>
              </div>
            </div>

            <div className='mx-auto mt-14 max-w-5xl sm:mt-16'>
              <HeroWorkflowVisual />
              <p className='mt-4 text-center font-mono text-[11px] text-zinc-400'>
                The code, workflow graph, and running version describe the same system.
              </p>
            </div>
          </div>
        </section>

        <section className='border-y border-zinc-200 px-6 py-24 sm:py-32 lg:px-8 dark:border-zinc-800'>
          <div className='mx-auto max-w-5xl'>
            <SectionHeading
              align='center'
              title='Workflows start simple. Then they become software.'
              description='A webhook becomes a queue. A script needs retries. Then come approvals, long-running jobs, concurrency, failures, and people who need to understand what is happening.'
            />

            <div className='mt-16 grid gap-8 md:grid-cols-2'>
              <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40'>
                <div className='font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>Visual automation</div>
                <p className='mt-4 text-lg leading-8 text-zinc-800 dark:text-zinc-200'>
                  Easy to understand — until application logic is spread across nodes, scripts, expressions, and external services.
                </p>
              </div>
              <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40'>
                <div className='font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase'>Code-first workflows</div>
                <p className='mt-4 text-lg leading-8 text-zinc-800 dark:text-zinc-200'>
                  Powerful for developers — until the people operating the business process cannot see or safely interact with it.
                </p>
              </div>
            </div>

            <div className='mt-14 text-center'>
              <p className='text-2xl font-medium tracking-[-0.03em] text-zinc-950 sm:text-3xl dark:text-zinc-50'>
                You should not have to choose.
              </p>
            </div>
          </div>
        </section>

        <section id='product' className='px-6 py-24 sm:py-32 lg:px-8'>
          <div className='mx-auto max-w-5xl'>
            <SectionHeading
              eyebrow='One workflow'
              title="The canvas isn't a second version of your workflow."
              description='Developers keep the workflow in real code. Flowcordia gives that same workflow a visual representation for understanding, operations, and controlled changes.'
            />
            <div className='mt-12'>
              <CodeCanvasVisual />
            </div>
            <div className='mt-8 grid gap-6 sm:grid-cols-3'>
              <Capability
                icon={<GitBranch className='h-4 w-4' />}
                title='Source stays in Git'
                description='Workflow logic remains reviewable, versioned, and owned by the codebase.'
              />
              <Capability
                icon={<Eye className='h-4 w-4' />}
                title='The graph stays understandable'
                description='Operators can see the process without reading the implementation behind every step.'
              />
              <Capability
                icon={<UserCheck className='h-4 w-4' />}
                title='Developers set the boundaries'
                description='Expose only the controls and actions that are safe for teams to operate visually.'
              />
            </div>
          </div>
        </section>

        <section className='border-y border-zinc-200 bg-zinc-50/70 px-6 py-24 sm:py-32 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900/20'>
          <div className='mx-auto max-w-5xl'>
            <SectionHeading
              eyebrow='Built for real work'
              title="Failures are part of the workflow. Starting over shouldn't be."
              description='Flowcordia handles the execution around your code: queues, retries, waits, concurrency, versioning, and recovery for work that can run far beyond a request-response cycle.'
            />
            <div className='mt-12'>
              <DurableExecutionVisual />
            </div>
            <p className='mt-6 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Retry the work that failed. Keep the work that already succeeded. Follow every run from one place.
            </p>
          </div>
        </section>

        <section className='px-6 py-24 sm:py-32 lg:px-8'>
          <div className='mx-auto grid max-w-5xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
            <div>
              <SectionHeading
                eyebrow='Developer experience'
                title='Use the tools you already trust.'
                description='Real functions. Real packages. Real tests. Real Git history. Your workflow belongs in your codebase — not trapped inside a visual editor.'
              />
            </div>
            <div className='overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-[0_22px_70px_-36px_rgba(0,0,0,0.4)] dark:border-zinc-800'>
              <div className='flex h-11 items-center gap-2 border-b border-zinc-800 px-4 font-mono text-[10px] text-zinc-500'>
                <Terminal className='h-3.5 w-3.5' /> terminal
              </div>
              <div className='p-6 font-mono text-xs leading-7 text-zinc-400'>
                <div><span className='text-zinc-600'>$</span> git clone github.com/ahamdjin/Flowcordia</div>
                <div><span className='text-zinc-600'>$</span> docker compose up</div>
                <div className='mt-5 text-emerald-300'>✓ control plane ready</div>
                <div className='text-emerald-300'>✓ worker connected</div>
                <div className='text-emerald-300'>✓ studio available</div>
              </div>
            </div>
          </div>
        </section>

        <section className='px-6 pb-24 sm:pb-32 lg:px-8'>
          <div className='mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 lg:p-10 dark:border-zinc-800 dark:bg-zinc-900/30'>
            <div className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
              <div>
                <Eyebrow>For the people running the work</Eyebrow>
                <h2 className='text-3xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50'>
                  Give your team visibility without giving up control.
                </h2>
                <p className='mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-300'>
                  Developers decide what can be operated visually. Teams can inspect runs, approve work, retry failures, and follow progress without digging through application code.
                </p>
              </div>
              <div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950'>
                <div className='flex items-start justify-between gap-5'>
                  <div>
                    <div className='font-mono text-[10px] tracking-[0.14em] text-zinc-400 uppercase'>Payment review</div>
                    <div className='mt-3 text-2xl font-medium tracking-[-0.03em] text-zinc-950 dark:text-zinc-50'>$18,420.00</div>
                    <div className='mt-1 text-sm text-zinc-500'>Acme Inc.</div>
                  </div>
                  <span className='rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-700 dark:text-amber-300'>waiting</span>
                </div>
                <div className='mt-7 border-t border-zinc-100 pt-5 dark:border-zinc-800'>
                  <div className='text-xs font-medium text-zinc-800 dark:text-zinc-200'>Waiting for finance approval</div>
                  <div className='mt-4 flex gap-2'>
                    <span className='rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300'>Reject</span>
                    <span className='rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-950'>Approve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='border-y border-zinc-200 px-6 py-24 sm:py-32 lg:px-8 dark:border-zinc-800'>
          <div className='mx-auto max-w-5xl'>
            <SectionHeading
              eyebrow='Your infrastructure'
              title='Run Flowcordia where your workflows belong.'
              description='Self-host Flowcordia and keep control of your execution environment, workflow code, data, and infrastructure.'
            />
            <div className='mt-12'>
              <ArchitectureVisual />
            </div>
            <div className='mt-8'>
              <Link
                href='/docs/self-hosting'
                className='inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300'
              >
                Explore self-hosting
                <ChevronRight className='ml-1 h-4 w-4' />
              </Link>
            </div>
          </div>
        </section>

        <section className='px-6 py-28 sm:py-40 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <Eyebrow>Open source · built in public</Eyebrow>
            <h2 className='text-4xl font-medium tracking-[-0.045em] text-zinc-950 sm:text-5xl dark:text-zinc-50'>
              Your workflows are software.
              <br />
              Build them like software.
            </h2>
            <p className='mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300'>
              Start with the repository, inspect the architecture, and run Flowcordia on your own infrastructure.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <a
                href='https://github.com/ahamdjin/Flowcordia'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button>
                  <GitHubIcon className='mr-2 h-4 w-4 fill-current' />
                  Start with GitHub
                </Button>
              </a>
              <Link href='/docs/getting-started'>
                <Button variant='secondary'>
                  Getting started
                  <ChevronRight className='ml-1.5 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
