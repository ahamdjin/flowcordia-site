import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { APP_DOC_PATHS, findAppDocGuide } from '@/lib/app-doc-guides';

export const dynamicParams = false;
export function generateStaticParams() {
  return APP_DOC_PATHS.map((path) => ({ slug: path.split('/') }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Metadata {
  const guide = findAppDocGuide(params.slug.join('/'));
  return {
    title: guide ? `${guide.title} - Flowcordia` : 'Guide not found',
    description: guide?.introduction,
  };
}
export default function RuntimeGuide({
  params,
}: {
  params: { slug: string[] };
}) {
  const guide = findAppDocGuide(params.slug.join('/'));
  if (!guide) notFound();
  return (
    <>
      <p className='text-sm text-zinc-500'>Runtime guide</p>
      <h1>{guide.title}</h1>
      <p>{guide.introduction}</p>
      {guide.availability && (
        <p className='border-l-2 border-amber-500 pl-4'>{guide.availability}</p>
      )}
      {guide.sections.map((section) => (
        <section key={section.id}>
          <h2 id={section.id} data-heading='2'>
            {section.title}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <h2>Next steps</h2>
      <p>
        For commands and SDK signatures, use version-specific instructions in
        the{' '}
        <a href='https://github.com/flowcordia/flowcordia'>
          application repository
        </a>
        . This operational guide does not claim every provider or infrastructure
        feature is enabled in your installation.
      </p>
      <p>
        <Link href='/docs/runtime'>All runtime guides</Link> ·{' '}
        <Link href='/docs/api'>API and MCP</Link> ·{' '}
        <Link href='/docs/troubleshooting'>Troubleshooting</Link> ·{' '}
        <Link href='/docs/capability-status'>Beta capability status</Link>
      </p>
    </>
  );
}
