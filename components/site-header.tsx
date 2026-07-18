import Link from "next/link";
import { FlowcordiaLogo } from "@/components/flowcordia-logo";
import { ArrowUpRightIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const githubUrl = "https://github.com/ahamdjin/Flowcordia";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Flowcordia home">
          <FlowcordiaLogo />
          <span className="status-chip">preview</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#system">Product</Link>
          <Link href="/docs">Docs</Link>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        </nav>

        <div className="site-actions">
          <ThemeToggle />
          <a className="header-cta" href={githubUrl} target="_blank" rel="noreferrer">
            View source
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
