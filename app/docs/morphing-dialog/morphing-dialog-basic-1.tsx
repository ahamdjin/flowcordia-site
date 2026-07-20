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
  CodeCanvasDetails,
  CodeCanvasPreview,
} from '@/components/website/code-canvas-sync';

export function MorphingDialogBasicOne() {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.04,
        duration: 0.32,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '12px',
        }}
        className='group flex h-full w-full flex-col overflow-hidden bg-white text-left dark:bg-zinc-950'
      >
        <div className='flex items-start justify-between gap-8 px-7 pt-7 pb-6 sm:px-10 sm:pt-9 sm:pb-7'>
          <div className='max-w-xl'>
            <div className='text-[10px] font-medium tracking-[0.09em] text-zinc-400 uppercase dark:text-zinc-500'>
              01 · One workflow, two surfaces
            </div>
            <MorphingDialogTitle className='mt-3 text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              Code and canvas are the same workflow.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-lg text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Write it in TypeScript and the canvas forms beside it. Change it
              visually and Flowcordia returns an exact source diff for review.
            </MorphingDialogSubtitle>
          </div>

          <div className='hidden shrink-0 pt-1 font-mono text-[10px] text-zinc-400 sm:block dark:text-zinc-500'>
            release.workflow.ts · synced
          </div>
        </div>

        <CodeCanvasPreview />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '24px',
          }}
          className='pointer-events-auto relative flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[1040px] flex-col overflow-y-auto border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-950'
        >
          <div className='px-7 pt-7 pb-6 pr-16 sm:px-9 sm:pt-9 sm:pb-8'>
            <div className='text-[10px] font-medium tracking-[0.09em] text-zinc-400 uppercase dark:text-zinc-500'>
              Synchronized workflow
            </div>
            <MorphingDialogTitle className='mt-3 max-w-2xl text-2xl font-medium tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-3xl'>
              One workflow. Two ways to work.
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='mt-3 max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
              Select a source line or canvas step. Change the approval timeout and
              inspect the exact Git proposal developers would review.
            </MorphingDialogSubtitle>
          </div>

          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 12 },
            }}
          >
            <CodeCanvasDetails />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
