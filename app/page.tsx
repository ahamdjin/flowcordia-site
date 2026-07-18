import Link from "next/link";
import { HeroDemo } from "@/components/hero-demo";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookIcon,
  CanvasIcon,
  CheckIcon,
  CodeIcon,
  GitBranchIcon,
  PlayIcon,
  ShieldIcon,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const githubUrl = "https://github.com/ahamdjin/Flowcordia";

const principles = [
  {
    number: "01",
    title: "Build on the canvas",
    copy: "Compose approved capabilities visually without reducing the workflow to a disposable mockup.",
    icon: CanvasIcon,
  },
  {
    number: "02",
    title: "Extend with typed code",
    copy: "Developers publish schema-bound functions that become safe, reusable nodes in Studio.",
    icon: CodeIcon,
  },
  {
    number: "03",
    title: "Review through Git",
    copy: "Workflow intent and generated runtime code move together through an exact pull request.",
    icon: GitBranchIcon,
  },
  {
    number: "04",
    title: "Run the reviewed version",
    copy: "Preview and production execution stay bound to the immutable commit that was approved.",
    icon: PlayIcon,
  },
];

export default function HomePage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <Reveal>
              <div className="eyebrow"><span />Open-source workflow infrastructure</div>
              <h1>Build visually.<br />Govern as code.</h1>
              <p>
                Flowcordia keeps the canvas, typed functions, Git review, preview deployments, and runtime execution connected to one workflow identity.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#system">
                  Explore the system <ArrowRightIcon />
                </a>
                <a className="button button-light" href={githubUrl} target="_blank" rel="noreferrer">
                  View on GitHub <ArrowUpRightIcon />
                </a>
              </div>
              <div className="hero-note"><span className="note-dot" />In active development. Built in public.</div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="hero-visual"><HeroDemo /></Reveal>
        </section>

        <section className="statement-section" id="system">
          <Reveal>
            <span className="section-index">The system</span>
            <h2>One workflow should not become five disconnected versions of the truth.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>Flowcordia gives business builders, developers, reviewers, and operators different working surfaces without giving the workflow different identities.</p>
          </Reveal>
        </section>

        <section className="principles-grid" aria-label="Flowcordia lifecycle">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <Reveal key={principle.number} delay={index * 0.05} className="principle-card">
                <div className="principle-head"><span>{principle.number}</span><Icon /></div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </Reveal>
            );
          })}
        </section>

        <section className="product-story-section">
          <Reveal className="story-copy">
            <span className="section-index">Shared ownership</span>
            <h2>The visual editor does not pretend code disappeared.</h2>
            <p>Repository functions keep their source path, export identity, schemas, and review history. Studio can use them without taking arbitrary control of the repository.</p>
            <ul className="feature-list">
              <li><CheckIcon />Exact-commit function discovery</li>
              <li><CheckIcon />Schema-driven inputs and outputs</li>
              <li><CheckIcon />Static imports in generated tasks</li>
              <li><CheckIcon />Runtime contract validation</li>
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="code-proof-card">
            <div className="proof-card-head"><span><CodeIcon />qualify-lead.ts</span><span className="proof-state">Developer owned</span></div>
            <div className="proof-code">
              <div><span>01</span><code><b>export const</b> qualifyLead = <b>async</b> (input) =&gt; {'{'}</code></div>
              <div><span>02</span><code>&nbsp;&nbsp;<b>const</b> score = <b>await</b> model.score(input);</code></div>
              <div className="proof-code-active"><span>03</span><code>&nbsp;&nbsp;<b>return</b> {'{'} qualified: score &gt;= 72, score {'}'};</code></div>
              <div><span>04</span><code>{'}'};</code></div>
            </div>
            <div className="proof-flow">
              <div><span className="proof-node-dot violet" /><strong>Studio node</strong><small>function: qualify-lead</small></div>
              <ArrowRightIcon />
              <div><span className="proof-node-dot blue" /><strong>Git proposal</strong><small>source + workflow</small></div>
              <ArrowRightIcon />
              <div><span className="proof-node-dot green" /><strong>Runtime</strong><small>validated output</small></div>
            </div>
          </Reveal>
        </section>

        <section className="governance-section">
          <Reveal className="governance-visual">
            <div className="commit-orbit">
              <div className="orbit-ring orbit-one" /><div className="orbit-ring orbit-two" />
              <div className="commit-core"><GitBranchIcon /><span>2f73d183</span></div>
              <span className="orbit-label label-canvas">Canvas</span>
              <span className="orbit-label label-code">Source</span>
              <span className="orbit-label label-review">Review</span>
              <span className="orbit-label label-runtime">Runtime</span>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="story-copy governance-copy">
            <span className="section-index">Governed delivery</span>
            <h2>The commit is not metadata. It is the execution boundary.</h2>
            <p>Proposal branches, pull requests, preview deployments, and live runs are rechecked against the exact workflow head. A different commit is a different version.</p>
            <div className="small-proof-grid">
              <div><ShieldIcon /><strong>No blind promotion</strong><span>Approval and checks apply to the current head.</span></div>
              <div><GitBranchIcon /><strong>Git stays authoritative</strong><span>Production changes remain reviewable and reversible.</span></div>
            </div>
          </Reveal>
        </section>

        <section className="docs-teaser-section">
          <Reveal className="docs-teaser-copy">
            <span className="section-index">Documentation</span>
            <h2>Understand the system before depending on it.</h2>
            <p>The docs explain the workflow model, Git lifecycle, developer functions, runtime boundaries, self-hosting direction, and what is deliberately not supported yet.</p>
            <Link className="text-link" href="/docs">Read the documentation <ArrowRightIcon /></Link>
          </Reveal>
          <Reveal delay={0.08} className="docs-window">
            <div className="docs-sidebar-preview">
              <div className="docs-search-preview">Search documentation <kbd>⌘ K</kbd></div>
              <span>Introduction</span><strong>What is Flowcordia?</strong><strong>Getting started</strong>
              <span>Core concepts</span><strong className="selected">Git-native workflows</strong><strong>Typed functions</strong><strong>Preview deployments</strong>
            </div>
            <div className="docs-content-preview">
              <span className="docs-breadcrumb">Core concepts / Git-native workflows</span>
              <h3>Git is the governed history.</h3>
              <p>Every production change resolves to an immutable commit, reviewed proposal, and exact deployment version.</p>
              <div className="docs-callout"><BookIcon /><span><strong>Core invariant</strong> The browser never chooses repository credentials, installation identity, or the version that is promoted.</span></div>
            </div>
          </Reveal>
        </section>

        <section className="closing-section">
          <Reveal>
            <span className="section-index">Built in public</span>
            <h2>Workflow infrastructure should be inspectable.</h2>
            <p>Follow the implementation, read the architectural decisions, and see every product boundary evolve through Git.</p>
            <div className="hero-actions closing-actions">
              <a className="button button-dark" href={githubUrl} target="_blank" rel="noreferrer">Explore the repository <ArrowUpRightIcon /></a>
              <Link className="button button-light" href="/docs">Start with the docs <ArrowRightIcon /></Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
