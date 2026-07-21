import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import { FlowcordiaLogo } from './flowcordia-logo';
import GitHubIcon from './icons/github';
import ThemeSwitch from './theme-switch';

export function Header() {
  return (
    <header className='sticky top-0 z-30 flex h-16 items-center justify-center border-b border-zinc-200 bg-white/95 px-6 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95'>
      <div className='mx-auto flex w-full items-center justify-between md:max-w-7xl'>
        <Link href='/' className='relative flex items-center space-x-2'>
          <FlowcordiaLogo className='h-6 w-auto' />
          <div className='text-sm font-medium text-zinc-950 dark:text-white'>
            Flowcordia
          </div>
          <span className='mb-4 ml-0 rounded-sm bg-zinc-800 px-1.5 py-0.5 text-[10px] leading-none font-medium text-zinc-50 select-none'>
            alpha
          </span>
        </Link>

        <div className='flex items-center space-x-5'>
          <nav className='hidden items-center space-x-5 sm:flex'>
            <Link
              href='/'
              className='hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 md:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Product
            </Link>
            <Link
              href='/self-hosting'
              className='hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 md:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Self-hosting
            </Link>
            <Link
              href='/roadmap'
              className='hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 lg:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Roadmap
            </Link>
            <Link
              href='/community'
              className='hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 xl:inline-flex dark:text-zinc-300 dark:hover:text-white'
            >
              Community
            </Link>
            <Link
              href='/docs'
              className='text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
            >
              Docs
            </Link>
          </nav>

          <div className='hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800' />

          <nav className='flex items-center space-x-1'>
            <Link
              href='/community'
              aria-label='Flowcordia community'
              className='inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
            >
              <MessagesSquare className='h-4 w-4' />
            </Link>
            <a
              href='https://github.com/ahamdjin/Flowcordia'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Flowcordia on GitHub'
              className='inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
            >
              <GitHubIcon className='h-4 w-4 fill-current' />
            </a>
            <ThemeSwitch />
          </nav>
        </div>
      </div>
    </header>
  );
}
