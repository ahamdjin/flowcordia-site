import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Understand Flowcordia's workflow model, Git lifecycle, runtime boundaries, and current capabilities.",
};

export default function DocsHomePage() {
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Introduction</div>
      <h1 id="overview">What is Flowcordia?</h1>
      <p className="docs-lead">Flowcordia is a Git-native workflow platform where visual builders and developers collaborate on the same reviewed workflow.</p>

      <div className="docs-status-card">
        <span className="status-pulse" />
        <div><strong>Current status</strong><p>Flowcordia is under active development. Core Studio, Git proposal, typed function, and exact-preview contracts are being built in public.</p></div>
      </div>

      <h2 id="model">One workflow, one identity</h2>
      <p>The workflow keeps stable identity across its canvas representation, canonical JSON document, generated task source, Git history, deployment version, and run history.</p>

      <div className="docs-pipeline">
        {['Canvas', 'Workflow model', 'Git proposal', 'Deployment', 'Run'].map((item, index) => (
          <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 4 && <ArrowRightIcon />}</div>
        ))}
      </div>

      <h2 id="principles">Non-negotiable principles</h2>
      <div className="docs-principles">
        {[
          'Git remains the governed history for production changes.',
          'Secrets are referenced, never committed into workflow files.',
          'Unsupported code remains code instead of becoming a misleading graph.',
          'The exact reviewed commit identifies the executable version.',
        ].map((item) => <div key={item}><CheckIcon /><span>{item}</span></div>)}
      </div>

      <h2 id="next">Choose your path</h2>
      <div className="docs-link-grid">
        <Link href="/docs/getting-started"><span>Start here</span><strong>Getting started</strong><p>Understand the repository contract and the first workflow path.</p><ArrowRightIcon /></Link>
        <Link href="/docs/concepts/git-native-workflows"><span>Core concept</span><strong>Git-native workflows</strong><p>See how branches, proposals, review, and execution stay connected.</p><ArrowRightIcon /></Link>
      </div>
    </article>
  );
}
