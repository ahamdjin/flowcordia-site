import { AnimatedGroup } from '@/components/core/animated-group';

export function AnimatedGroupPreset() {
  return (
    <AnimatedGroup
      className='grid grid-cols-2 gap-4 p-8 md:grid-cols-3 lg:grid-cols-4'
      preset='scale'
    >
      <img
        src='/flowcordia-canvas.svg'
        alt='Flowcordia Studio canvas'
        className='h-auto w-full rounded-[4px]'
      />
      <img
        src='/flowcordia-source.svg'
        alt='Flowcordia typed source view'
        className='h-auto w-full rounded-[4px]'
      />
      <img
        src='/flowcordia-proposal.svg'
        alt='Flowcordia Git proposal view'
        className='h-auto w-full rounded-[4px]'
      />
      <img
        src='/flowcordia-run.svg'
        alt='Flowcordia workflow run view'
        className='h-auto w-full rounded-[4px]'
      />
    </AnimatedGroup>
  );
}
