'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  TimeoutValue,
  WorkspaceHeader,
  WorkspaceInspector,
  WorkspaceStep,
  WorkspaceSurface,
  WorkspaceTabs,
  WorkspaceView,
} from '@/components/website/card-one-workspace-surfaces';

function filenameFor(view: WorkspaceView) {
  if (view === 'source') return 'release.workflow.ts';
  if (view === 'canvas') return 'release.canvas';
  if (view === 'diff') return 'proposal.diff';
  return 'flowcordia terminal';
}

export function CodeCanvasDetails() {
  const [view, setView] = useState<WorkspaceView>('canvas');
  const [selected, setSelected] = useState<WorkspaceStep>('approval');
  const [timeout, setTimeout] = useState<TimeoutValue>('24h');
  const changed = timeout === '2h';

  const reset = () => {
    setView('canvas');
    setSelected('approval');
    setTimeout('24h');
  };

  return (
    <div className='flex min-h-[680px] w-full flex-col bg-[#0a0a0c] text-left sm:min-h-[650px]'>
      <WorkspaceHeader
        filename={filenameFor(view)}
        status={changed ? 'changed' : 'synced'}
      />

      <div className='flex shrink-0 items-center justify-between gap-5 border-b border-white/[0.06] px-5 py-4 sm:px-7'>
        <div>
          <div className='font-mono text-[8px] tracking-[0.12em] text-zinc-700 uppercase'>
            One workflow · two surfaces
          </div>
          <div className='mt-1 text-sm font-medium text-zinc-200 sm:text-base'>
            Edit either surface. Review one exact change.
          </div>
        </div>
        <div className='hidden items-center gap-2 font-mono text-[9px] text-zinc-600 sm:flex'>
          <span>main</span>
          <span>·</span>
          <span>7f91b2d</span>
        </div>
      </div>

      <div className='grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_250px]'>
        <div className='relative min-h-[430px] overflow-hidden'>
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={view}
              className='absolute inset-0'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <WorkspaceSurface
                view={view}
                timeout={timeout}
                selected={selected}
                onSelect={setSelected}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <WorkspaceInspector
          selected={selected}
          timeout={timeout}
          onTimeout={(value) => {
            setSelected('approval');
            setTimeout(value);
          }}
          onReset={reset}
        />
      </div>

      <WorkspaceTabs
        active={view}
        status={changed ? '1 synchronized change' : 'source clean'}
        onChange={setView}
      />
    </div>
  );
}
