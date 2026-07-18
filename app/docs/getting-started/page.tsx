import type { Metadata } from "next";

export const metadata: Metadata = { title: "Getting started" };

export default function GettingStartedPage() {
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Introduction</div>
      <h1 id="overview">Getting started</h1>
      <p className="docs-lead">The public onboarding flow is still being prepared. This page documents the repository contract that the current product uses.</p>
      <h2 id="model">Repository structure</h2>
      <p>A Flowcordia-enabled repository stores canonical workflows and optional typed function definitions alongside the application code.</p>
      <pre className="docs-code"><code>{`.flowcordia/\n  workflows/\n    lead_intake.json\n  functions.json\n\ntrigger/\n  flowcordia/\n    lead_intake.ts`}</code></pre>
      <h2 id="principles">Current prerequisites</h2>
      <ul className="docs-list">
        <li>A connected GitHub repository and configured production branch.</li>
        <li>A valid Flowcordia workflow document.</li>
        <li>Trigger.dev preview deployments enabled for live preview.</li>
        <li>Appropriate repository and task-trigger permissions.</li>
      </ul>
      <h2 id="next">Public preview</h2>
      <p>Hosted onboarding instructions will be published when the public application path is ready to support them without manual internal setup.</p>
    </article>
  );
}
