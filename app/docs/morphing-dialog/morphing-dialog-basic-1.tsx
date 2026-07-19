import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/core/morphing-dialog';
import {
  CustomerOnboardingDetails,
  CustomerOnboardingPreview,
} from '@/components/website/customer-onboarding-workflow';
import { PlusIcon } from 'lucide-react';

export function MorphingDialogBasicOne() {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '12px',
        }}
        className='flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white text-left dark:border-zinc-50/10 dark:bg-zinc-900'
      >
        <CustomerOnboardingPreview />
        <div className='flex grow flex-row items-end justify-between px-3 py-2.5'>
          <div className='min-w-0'>
            <MorphingDialogTitle className='truncate text-sm font-medium text-zinc-950 dark:text-zinc-50'>
              Customer onboarding
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-0.5 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400'>
              acme/operations
            </MorphingDialogSubtitle>
          </div>
          <span
            aria-hidden='true'
            className='relative ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors group-hover:bg-zinc-100 group-hover:text-zinc-800 dark:border-zinc-50/10 dark:text-zinc-500 dark:group-hover:bg-zinc-800 dark:group-hover:text-zinc-50'
          >
            <PlusIcon size={12} />
          </span>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '24px',
          }}
          className='pointer-events-auto relative flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[720px] flex-col overflow-y-auto border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
        >
          <div className='px-6 pt-6 pb-5 pr-16'>
            <MorphingDialogTitle className='text-xl font-medium text-zinc-950 dark:text-zinc-50 sm:text-2xl'>
              Customer onboarding
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400'>
              acme/operations · Production · a84f2c1
            </MorphingDialogSubtitle>
          </div>

          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 16 },
            }}
          >
            <CustomerOnboardingDetails />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
