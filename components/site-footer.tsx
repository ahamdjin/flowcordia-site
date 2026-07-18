import Link from "next/link";
import { FlowcordiaLogo } from "@/components/flowcordia-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <FlowcordiaLogo />
          <p>Canvas, code, Git, and runtime. Kept connected.</p>
        </div>
        <div className="footer-links">
          <Link href="/docs">Documentation</Link>
          <a href="https://github.com/ahamdjin/Flowcordia" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://app.flowcordia.com" target="_blank" rel="noreferrer">Open app</a>
        </div>
      </div>
    </footer>
  );
}
