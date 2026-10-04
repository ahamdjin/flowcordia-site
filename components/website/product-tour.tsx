import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_CARDS } from '@/lib/product-cards';

export function ProductTour() {
  return (
    <div className='space-y-12'>
      {PRODUCT_CARDS.map((card) => (
        <section key={card.id} id={card.id} className='scroll-mt-24'>
          <h2>{card.title}</h2>
          <p>
            {card.status}. This is a concept or demonstration, not a verified
            production capability.
          </p>
          <a href={card.image} aria-label={`Open full image: ${card.title}`}>
            <Image
              src={card.image}
              alt={`Flowcordia ${card.title} demonstration`}
              width={768}
              height={600}
              className='h-auto w-full rounded-lg border border-zinc-200 dark:border-zinc-800'
            />
          </a>
          <p>
            <Link href={card.guide}>Read the guide</Link>
          </p>
        </section>
      ))}
    </div>
  );
}
