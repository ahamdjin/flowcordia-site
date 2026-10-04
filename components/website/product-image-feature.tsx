import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ProductCard } from '@/lib/product-cards';

export function ProductImageFeature({
  card,
  title,
  description,
}: {
  card: ProductCard;
  title: string;
  description: string;
}) {
  return (
    <figure data-product-card={card.id} className='space-y-6'>
      <div className='max-w-xl'>
        <p className='mb-3 text-xs text-zinc-500 dark:text-zinc-400'>
          {card.title}
        </p>
        <h2 className='text-2xl leading-tight font-medium text-zinc-950 sm:text-3xl dark:text-white'>
          {title}
        </h2>
        <p className='mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400'>
          {description}
        </p>
      </div>
      <a
        href={card.image}
        aria-label={`Open ${card.title} illustration`}
        className='block overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800'
      >
        <Image
          src={card.image}
          alt={
            card.title === 'Policy as code'
              ? 'Concept: identity, environment, secret references and approval connected to one release.'
              : 'Concept: a workflow canvas, TypeScript source, reviewed diff and execution result shown together.'
          }
          width={1536}
          height={1024}
          sizes='(max-width: 768px) 100vw, 768px'
          className='h-auto w-full'
        />
      </a>
      <figcaption className='flex items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400'>
        <span>Concept illustration</span>
        <Link
          href={card.guide}
          className='inline-flex items-center gap-1 text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white'
        >
          Read the guide <ArrowUpRight className='h-3.5 w-3.5' />
        </Link>
      </figcaption>
    </figure>
  );
}
