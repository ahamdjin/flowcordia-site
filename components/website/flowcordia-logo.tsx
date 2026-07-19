type FlowcordiaLogoProps = {
  className?: string;
};

export function FlowcordiaLogo({
  className = 'h-6 w-auto',
}: FlowcordiaLogoProps) {
  return (
    <span className='inline-flex shrink-0' aria-hidden='true'>
      <img
        src='/flowcordia-logo-black.svg'
        alt=''
        className={`${className} block dark:hidden`}
      />
      <img
        src='/flowcordia-logo-white.svg'
        alt=''
        className={`${className} hidden dark:block`}
      />
    </span>
  );
}
