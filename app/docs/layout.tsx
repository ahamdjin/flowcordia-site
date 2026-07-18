import Link from "next/link";
import { BookIcon, GitBranchIcon, ShieldIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    label: "Introduction",
    links: [
      { href: "/docs", label: "What is Flowcordia?" },
      { href: "/docs/getting-started", label: "Getting started" },
    ],
  },
  {
    label: "Core concepts",
    links: [
      { href: "/docs/concepts/git-native-workflows", label: "Git-native workflows" },
      { href: "/docs", label: "Workflow identity" },
      { href: "/docs", label: "Typed functions" },
      { href: "/docs", label: "Preview deployments" },
    ],
  },
  {
    label: "Operate",
    links: [
      { href: "/docs", label: "Security boundaries" },
      { href: "/docs", label: "Self-hosting" },
      { href: "/docs", label: "Capability status" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-site-shell">
      <SiteHeader />
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-search"><BookIcon />Search documentation <kbd>⌘ K</kbd></div>
          <nav aria-label="Documentation">
            {sections.map((section) => (
              <div className="docs-nav-group" key={section.label}>
                <span>{section.label}</span>
                {section.links.map((link) => <Link href={link.href} key={`${section.label}-${link.label}`}>{link.label}</Link>)}
              </div>
            ))}
          </nav>
          <div className="docs-sidebar-note"><ShieldIcon /><span>Documentation follows implemented boundaries, not aspirational feature claims.</span></div>
        </aside>
        <main className="docs-main">{children}</main>
        <aside className="docs-toc">
          <span>On this page</span>
          <a href="#overview">Overview</a>
          <a href="#model">The model</a>
          <a href="#principles">Principles</a>
          <a href="#next">Next steps</a>
          <div className="docs-github-link"><GitBranchIcon /><a href="https://github.com/ahamdjin/Flowcordia" target="_blank" rel="noreferrer">Edit on GitHub</a></div>
        </aside>
      </div>
    </div>
  );
}
