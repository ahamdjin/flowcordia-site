"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CanvasIcon, CheckIcon, CodeIcon, GitBranchIcon, PlayIcon } from "@/components/icons";

const stages = [
  { id: "canvas", label: "Canvas", icon: CanvasIcon },
  { id: "source", label: "Source", icon: CodeIcon },
  { id: "review", label: "Review", icon: GitBranchIcon },
  { id: "run", label: "Run", icon: PlayIcon },
] as const;

type StageId = (typeof stages)[number]["id"];

function WindowChrome({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="demo-window">
      <div className="demo-window-bar">
        <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span>{label}</span>
        <span className="window-sha">2f73d183</span>
      </div>
      <div className="demo-window-content">{children}</div>
    </div>
  );
}

function CanvasScene() {
  const nodes = [
    { id: "lead", label: "New lead", detail: "webhook", x: 32, y: 86, tone: "violet" },
    { id: "qualify", label: "Qualify lead", detail: "typed function", x: 268, y: 42, tone: "blue" },
    { id: "route", label: "Route owner", detail: "condition", x: 504, y: 86, tone: "amber" },
    { id: "sync", label: "Sync CRM", detail: "http request", x: 740, y: 42, tone: "green" },
    { id: "notify", label: "Notify team", detail: "output", x: 740, y: 158, tone: "pink" },
  ];

  return (
    <div className="canvas-scene">
      <svg className="canvas-lines" viewBox="0 0 960 270" preserveAspectRatio="none" aria-hidden="true">
        <path d="M176 122 C220 122 220 78 268 78" />
        <path d="M412 78 C460 78 456 122 504 122" />
        <path d="M648 122 C692 122 692 78 740 78" />
        <path d="M648 122 C692 122 692 194 740 194" />
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          className={`canvas-node node-${node.tone}`}
          style={{ left: `${(node.x / 960) * 100}%`, top: node.y }}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.07, duration: 0.4 }}
        >
          <div className="node-topline"><span className="node-dot" />{node.detail}</div>
          <strong>{node.label}</strong>
          <span className="node-id">{node.id}</span>
        </motion.div>
      ))}
      <motion.div
        className="canvas-pulse"
        initial={{ left: "17%", top: 117, opacity: 0 }}
        animate={{ left: ["17%", "40%", "65%", "88%"], top: [117, 73, 117, 73], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.7, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}

function SourceScene() {
  const lines = [
    ["1", "export const qualifyLead = async (input: LeadInput) => {"],
    ["2", "  const score = await model.score(input);"],
    ["3", ""],
    ["4", "  return {"],
    ["5", "    qualified: score >= 72,"],
    ["6", "    score,"],
    ["7", "    owner: score >= 90 ? \"enterprise\" : \"growth\","],
    ["8", "  };"],
    ["9", "};"],
  ];

  return (
    <div className="source-scene">
      <aside className="source-sidebar">
        <span className="source-label">Repository functions</span>
        <button className="source-file active"><CodeIcon />qualify-lead.ts<span>changed</span></button>
        <button className="source-file"><CodeIcon />route-owner.ts<span>clean</span></button>
      </aside>
      <div className="code-editor" aria-label="Typed function source preview">
        <div className="editor-path">src/functions/qualify-lead.ts</div>
        <div className="code-lines">
          {lines.map(([number, line], index) => (
            <motion.div
              key={number}
              className={`code-line ${index === 4 || index === 6 ? "code-highlight" : ""}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.035 }}
            >
              <span>{number}</span><code>{line || " "}</code>
            </motion.div>
          ))}
        </div>
        <div className="editor-status"><span>TypeScript</span><span>Input and output validated</span></div>
      </div>
    </div>
  );
}

function ReviewScene() {
  return (
    <div className="review-scene">
      <div className="review-summary">
        <div className="review-title-row">
          <div>
            <span className="review-kicker">Draft pull request</span>
            <h3>Update lead qualification workflow</h3>
          </div>
          <span className="review-badge">Ready for review</span>
        </div>
        <div className="review-route">
          <span>main</span><i />
          <span>flowcordia/lead-intake-9f31</span><i />
          <span>PR #42</span>
        </div>
        <div className="review-checks">
          {["Workflow contract", "Generated task", "Function schemas", "Preview build"].map((label, index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <CheckIcon />
              <span>{label}</span>
              <small>Passed</small>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="review-diff">
        <div className="diff-head"><span>trigger/flowcordia/lead_intake.ts</span><span>+12 −4</span></div>
        <pre><span className="diff-context">  id: &quot;lead-intake&quot;,</span>{"\n"}<span className="diff-remove">- owner: &quot;round-robin&quot;,</span>{"\n"}<span className="diff-add">+ owner: result.owner,</span>{"\n"}<span className="diff-add">+ score: result.score,</span>{"\n"}<span className="diff-context">  await syncCrm(result);</span></pre>
      </div>
    </div>
  );
}

function RunScene() {
  const rows = [
    { label: "New lead", time: "0 ms", status: "Succeeded" },
    { label: "Qualify lead", time: "486 ms", status: "Succeeded" },
    { label: "Route owner", time: "3 ms", status: "Succeeded" },
    { label: "Sync CRM", time: "742 ms", status: "Succeeded" },
    { label: "Notify team", time: "128 ms", status: "Succeeded" },
  ];

  return (
    <div className="run-scene">
      <div className="run-overview">
        <span className="run-kicker">Exact preview version</span>
        <div className="run-headline"><span className="success-ring"><CheckIcon /></span><div><h3>Run completed</h3><p>Every node executed from commit 2f73d183.</p></div></div>
        <div className="run-metrics"><div><span>Duration</span><strong>1.36s</strong></div><div><span>Version</span><strong>v20260719.3</strong></div><div><span>Environment</span><strong>Preview</strong></div></div>
      </div>
      <div className="run-list">
        {rows.map((row, index) => (
          <motion.div
            className="run-row"
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.09 }}
          >
            <span className="run-line-dot"><CheckIcon /></span>
            <strong>{row.label}</strong>
            <small>{row.time}</small>
            <em>{row.status}</em>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const sceneMap: Record<StageId, React.ReactNode> = {
  canvas: <CanvasScene />,
  source: <SourceScene />,
  review: <ReviewScene />,
  run: <RunScene />,
};

export function HeroDemo() {
  const [active, setActive] = useState<StageId>("canvas");
  const reduceMotion = useReducedMotion();
  const activeIndex = useMemo(() => stages.findIndex((stage) => stage.id === active), [active]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = stages.findIndex((stage) => stage.id === current);
        return stages[(index + 1) % stages.length].id;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="hero-demo-shell">
      <div className="demo-tabs" role="tablist" aria-label="Flowcordia workflow lifecycle">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={active === stage.id}
              className={active === stage.id ? "active" : ""}
              onClick={() => setActive(stage.id)}
            >
              <Icon />
              <span>{stage.label}</span>
              {active === stage.id && <motion.span className="tab-progress" layoutId="tab-progress" />}
              {index < stages.length - 1 && <span className="tab-separator" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <WindowChrome label={stages[activeIndex].label}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="demo-scene"
          >
            {sceneMap[active]}
          </motion.div>
        </AnimatePresence>
      </WindowChrome>
      <div className="demo-caption">
        <span>One workflow identity</span>
        <span className="caption-line" />
        <span>Every surface stays connected</span>
      </div>
    </div>
  );
}
