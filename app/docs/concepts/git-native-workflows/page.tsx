import type { Metadata } from "next";

export const metadata: Metadata = { title: "Git-native workflows" };

export default function GitNativeWorkflowsPage() {
  return (
    <article className="docs-article">
      <div className="docs-eyebrow">Core concepts</div>
      <h1 id="overview">Git-native workflows</h1>
      <p className="docs-lead">Git is not a backup export. It is the governed history for workflow definitions, reviews, releases, and rollback.</p>
      <h2 id="model">The proposal lifecycle</h2>
      <ol className="docs-numbered-list">
        <li><span>1</span><div><strong>Start from an exact commit</strong><p>Studio binds the draft to an immutable repository version.</p></div></li>
        <li><span>2</span><div><strong>Edit safely</strong><p>Visual changes use a bounded command model. Source changes remain separate durable buffers.</p></div></li>
        <li><span>3</span><div><strong>Publish one proposal</strong><p>Canonical workflow JSON, generated task source, and governed source patches enter the same branch and pull request.</p></div></li>
        <li><span>4</span><div><strong>Run the reviewed head</strong><p>Preview execution is locked to the deployment version built from that exact proposal commit.</p></div></li>
      </ol>
      <h2 id="principles">Why this matters</h2>
      <p>Visual convenience should not remove review, traceability, rollback, or developer ownership. Flowcordia adds the canvas without creating a second, hidden source of truth.</p>
      <div className="docs-callout full"><strong>Invariant</strong><p>A changed proposal head is a changed executable version. Flowcordia fails closed instead of silently running an older deployment.</p></div>
      <h2 id="next">Related concepts</h2>
      <p>Next: typed repository functions, deterministic compilation, and exact-head preview deployments.</p>
    </article>
  );
}
