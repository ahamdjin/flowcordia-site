'use client';
import { InView } from '@/components/core/in-view';
import { motion } from 'motion/react';

const workflowLifecycle = [
  { src: '/flowcordia-canvas.svg', alt: 'Compose the workflow in Studio' },
  { src: '/flowcordia-workflow.svg', alt: 'Connect triggers, conditions, functions, and tasks' },
  { src: '/flowcordia-source.svg', alt: 'Extend the workflow with typed source' },
  { src: '/flowcordia-proposal.svg', alt: 'Publish a Git proposal' },
  { src: '/flowcordia-proposal.svg', alt: 'Review the exact workflow changes' },
  { src: '/flowcordia-run.svg', alt: 'Build a preview deployment from the proposal head' },
  { src: '/flowcordia-run.svg', alt: 'Execute the reviewed version' },
  { src: '/flowcordia-canvas.svg', alt: 'Return run status to the visual graph' },
  { src: '/flowcordia-source.svg', alt: 'Inspect logs and source together' },
  { src: '/flowcordia-proposal.svg', alt: 'Keep rollback in Git history' },
];

export function InViewImagesGrid() {
  return (
    <div className='h-full w-full overflow-auto'>
      <div className='mb-20 py-12 text-center text-sm'>
        Scroll through the workflow lifecycle
      </div>
      <div className='flex h-[1200px] items-end justify-center pb-12'>
        <InView
          viewOptions={{ once: true, margin: '0px 0px -250px 0px' }}
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
              },
            },
          }}
        >
          <div className='columns-2 gap-4 px-8 sm:columns-3'>
            {workflowLifecycle.map((item, index) => {
              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px)',
                    },
                  }}
                  key={`${item.alt}-${index}`}
                  className='mb-4'
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className='size-full rounded-lg object-contain'
                  />
                </motion.div>
              );
            })}
          </div>
        </InView>
      </div>
    </div>
  );
}
