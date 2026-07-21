import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Header } from '@/components/website/header';
import { SiteFooter } from '@/components/website/site-footer';

export type ResourceAction = {
  label: string;
  href: string;
  external?: boolean;
  primary?: boolean;
};

export type ResourceCard = {
  title: string;
  description: string;
  href?: string;
  external?: boolean;
};

export type ResourceSection = {
  id: string;
  title: string;
  description?: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
  note?: string;
  cards?: ResourceCard[];
};

export type ResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  actions: ResourceAction[];
  sections: ResourceSection[];
  closing?: {
    title: string;
    description: string;
    actions: ResourceAction[];
  };
};

function ActionLink({ action }: { action: ResourceAction }) {
  const className = action.primary
    ? 'inline-flex items-center gap-2 rounded-md bg-zinc-950 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200'
    : 'inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white';

  const content = (
    <>
      {action.label}
      {action.external ? (
        <ExternalLink className='h-3.5 w-3.5' />
      ) : (
        <ArrowRight className='h-3.5 w-3.5' />
      )}
    </>
  );

  if (action.external) {
    return (
      <a
        href={action.href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

function ResourceCardLink({ card }: { card: ResourceCard }) {
  const body = (
    <div className='group h-full rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700'>
      <div className='flex items-start justify-between gap-4'>
        <h3 className='text-sm font-medium text-zinc-950 dark:text-zinc-50'>
          {card.title}
        </h3>
        {card.href && (
          <ArrowRight className='mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5' />
        )}
      </div>
      <p className='mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
        {card.description}
      </p>
    </div>
  );

  if (!card.href) return body;

  if (card.external) {
    return (
      <a href={card.href} target='_blank' rel='noopener noreferrer'>
        {body}
      </a>
    );
  }

  return <Link href={card.href}>{body}</Link>;
}

export function ResourcePage({
  eyebrow,
  title,
  description,
  status = 'Open source · Internal alpha',
  actions,
  sections,
  closing,
}: ResourcePageProps) {
  return (
    <>
      <Header />
      <main className='px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <section className='border-b border-zinc-200 py-20 sm:py-24 dark:border-zinc-800'>
            <div className='max-w-3xl'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-[11px] font-medium tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400'>
                  {eyebrow}
                </span>
                <span className='rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'>
                  {status}
                </span>
              </div>
              <h1 className='mt-6 max-w-3xl text-4xl font-medium tracking-[-0.045em] text-zinc-950 sm:text-5xl dark:text-zinc-50'>
                {title}
              </h1>
              <p className='mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300'>
                {description}
              </p>
              <div className='mt-8 flex flex-wrap gap-3'>
                {actions.map((action) => (
                  <ActionLink key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
            </div>
          </section>

          <div className='grid gap-16 py-16 lg:grid-cols-[180px_minmax(0,1fr)] lg:py-24'>
            <aside className='hidden lg:block'>
              <div className='sticky top-28'>
                <div className='text-[10px] font-medium tracking-[0.12em] text-zinc-400 uppercase dark:text-zinc-500'>
                  On this page
                </div>
                <nav className='mt-5 space-y-3'>
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className='block text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className='max-w-3xl space-y-20'>
              {sections.map((section) => (
                <section key={section.id} id={section.id} className='scroll-mt-28'>
                  <h2 className='text-2xl font-medium tracking-[-0.03em] text-zinc-950 dark:text-zinc-50'>
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className='mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300'>
                      {section.description}
                    </p>
                  )}
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className='mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300'
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className='mt-6 space-y-3'>
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className='flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300'>
                          <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600' />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.code && (
                    <pre className='mt-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs leading-6 text-zinc-300'>
                      <code>{section.code}</code>
                    </pre>
                  )}
                  {section.note && (
                    <div className='mt-6 rounded-xl border border-[#D9A28D]/40 bg-[#D9A28D]/8 p-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300'>
                      {section.note}
                    </div>
                  )}
                  {section.cards && (
                    <div className='mt-7 grid gap-4 sm:grid-cols-2'>
                      {section.cards.map((card) => (
                        <ResourceCardLink key={card.title} card={card} />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>

          {closing && (
            <section className='mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-10 sm:px-10 dark:border-zinc-800 dark:bg-zinc-900/40'>
              <h2 className='text-2xl font-medium tracking-[-0.03em] text-zinc-950 dark:text-zinc-50'>
                {closing.title}
              </h2>
              <p className='mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300'>
                {closing.description}
              </p>
              <div className='mt-6 flex flex-wrap gap-3'>
                {closing.actions.map((action) => (
                  <ActionLink key={`${action.label}-${action.href}`} action={action} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
