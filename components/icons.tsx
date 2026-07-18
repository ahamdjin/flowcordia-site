import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconShell({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return <IconShell {...props}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></IconShell>;
}

export function ArrowRightIcon(props: IconProps) {
  return <IconShell {...props}><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></IconShell>;
}

export function GitBranchIcon(props: IconProps) {
  return <IconShell {...props}><circle cx="6" cy="5" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="19" r="2" /><path d="M6 7v10" /><path d="M8 7c5 0 5-1 8-1" /><path d="M16 8c0 5-3 6-8 6" /></IconShell>;
}

export function CodeIcon(props: IconProps) {
  return <IconShell {...props}><path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 6-4 12" /></IconShell>;
}

export function CanvasIcon(props: IconProps) {
  return <IconShell {...props}><rect x="3.5" y="4" width="17" height="16" rx="3" /><rect x="6.5" y="8" width="4" height="3" rx="1" /><rect x="13.5" y="13" width="4" height="3" rx="1" /><path d="M10.5 9.5h2c2 0 1 5 3 5" /></IconShell>;
}

export function PlayIcon(props: IconProps) {
  return <IconShell {...props}><path d="m9 7 8 5-8 5V7Z" /></IconShell>;
}

export function CheckIcon(props: IconProps) {
  return <IconShell {...props}><path d="m5 12 4 4L19 6" /></IconShell>;
}

export function BookIcon(props: IconProps) {
  return <IconShell {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" /></IconShell>;
}

export function ShieldIcon(props: IconProps) {
  return <IconShell {...props}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></IconShell>;
}
