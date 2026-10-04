import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
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
        bounce: 0.03,
        duration: 0.32,
      }}
    >
      <MorphingDialogTrigger
        style={{ borderRadius: '12px' }}
        className='group h-full w-full overflow-hidden bg-transparent text-left'
      >
        <CodeCanvasPreview />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: '22px' }}
          className='pointer-events-auto relative flex max-h-[calc(100vh-24px)] w-[calc(100vw-24px)] max-w-[1080px] flex-col overflow-y-auto border border-white/[0.10] bg-[#0a0a0c] shadow-2xl'
        >
          <MorphingDialogTitle className='sr-only'>
            Code and canvas stay the same workflow.
          </MorphingDialogTitle>
          <MorphingDialogSubtitle className='sr-only'>
            Edit either the TypeScript source or visual canvas and inspect the same exact reviewable change.
          </MorphingDialogSubtitle>

          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, scale: 0.99 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.99 },
            }}
          >
            <CodeCanvasDetails />
          </MorphingDialogDescription>

          <MorphingDialogClose className='flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.10] bg-[#17171b] text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
