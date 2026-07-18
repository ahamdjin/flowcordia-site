import type { SVGProps } from "react";

export function FlowcordiaMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      {...props}
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="9.5" fill="currentColor" />
      <path
        d="M8.5 10.25h6.75a6.5 6.5 0 1 1 0 13H8.5v-4h6.75a2.5 2.5 0 1 0 0-5H8.5v-4Z"
        fill="var(--mark-ink, white)"
      />
      <circle cx="8.5" cy="12.25" r="2" fill="var(--mark-accent, #8b7cf6)" />
      <circle cx="8.5" cy="21.25" r="2" fill="var(--mark-accent, #8b7cf6)" />
    </svg>
  );
}

export function FlowcordiaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup">
      <FlowcordiaMark className="brand-mark" />
      {!compact && <span className="brand-wordmark">Flowcordia</span>}
    </span>
  );
}
