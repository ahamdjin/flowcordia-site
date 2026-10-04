import Link from 'next/link';
import { APP_DOC_GUIDES } from '@/lib/app-doc-guides';

export const metadata = {
  title: 'Runtime guides - Flowcordia',
  description: 'Guides for documentation linked from the Flowcordia dashboard.',
};
export default function RuntimeGuides() {
  return (
    <>
      <h1>Runtime guides</h1>
      <p>
        These operational guides cover documentation destinations used by the
        app. Provider and infrastructure availability is separate from the
        presence of a dashboard page.
      </p>
      <ul>
        {APP_DOC_GUIDES.map((guide) => (
          <li key={guide.paths[0]}>
            <Link href={`/docs/${guide.paths[0]}`}>{guide.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        Start with <Link href='/docs/getting-started'>Getting started</Link> for
        Studio or <Link href='/docs/cli-dev'>Connect development</Link> for a
        task worker.
      </p>
    </>
  );
}
