'use client';
import { cn } from '@/lib/utils';
import { cloneElement, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { ArrowUpRight, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductCard } from '@/lib/product-cards';

export function CardExampleLanding({
  children,
  className,
  hasReTrigger,
  preview,
}: {
  children: React.ReactElement;
  className?: string;
  hasReTrigger?: boolean;
  preview?: ProductCard;
}) {
  const [reTriggerKey, setReTriggerKey] = useState(0);

  const reTrigger = () => {
    setReTriggerKey((key) => key + 1);
  };

  return (
    <div className='relative -mx-6 sm:mx-0' data-product-card={preview?.id}>
      <div className='pointer-events-none absolute top-[-100px] left-0 z-[-1] h-full w-full bg-[radial-gradient(100%_100%_at_50%_50%,hsl(0deg_0%_100%/8%)_0,hsl(0deg_0%_100%/2%)_50%)] blur-2xl md:left-[-100px] md:h-[calc(100%+200px)] md:w-[calc(100%+200px)]' />
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-zinc-50 p-4 shadow-[0px_0px_0px_1px_var(--color-zinc-100),0px_2px_2px_0px_var(--color-zinc-50)] dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none',
          className
        )}
      >
        {hasReTrigger && (
          <div
            className='absolute top-3 right-4 cursor-pointer'
            onClick={reTrigger}
          >
            <RotateCw className='h-4 w-4 text-zinc-500' />
          </div>
        )}
        <div
          className='flex h-[350px] items-center justify-center'
          data-product-preview={preview?.id}
        >
          {hasReTrigger
            ? cloneElement(children, { key: reTriggerKey })
            : children}
        </div>
      </div>
      {preview && (
        <footer className='mt-4 flex items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:px-0 dark:text-zinc-400'>
          <Link
            href={`/docs/product-tour#${preview.id}`}
            className='flex min-w-0 items-center gap-3 hover:text-zinc-950 dark:hover:text-white'
          >
            <Image
              src={preview.image}
              alt={`${preview.title} demo preview`}
              width={72}
              height={44}
              className='h-11 w-[72px] shrink-0 rounded border border-zinc-200 object-cover dark:border-zinc-800'
            />
            <span>
              <span className='block font-medium'>{preview.title}</span>
              <span className='mt-1 block text-[11px]'>{preview.status}</span>
            </span>
          </Link>
          <div className='flex shrink-0 items-center gap-4'>
            <a
              href={preview.image}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Open ${preview.title} image`}
              title='Open image'
            >
              <ImageIcon className='h-4 w-4' />
            </a>
            <Link
              href={preview.guide}
              className='inline-flex items-center gap-1'
            >
              Guide
              <ArrowUpRight className='h-3.5 w-3.5' />
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}
