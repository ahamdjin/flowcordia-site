'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  TimeoutValue,
  WorkspaceHeader,
  WorkspaceStep,
  WorkspaceSurface,
  WorkspaceTabs,
  WorkspaceView,
} from '@/components/website/card-one-workspace-surfaces';

export function CodeCanvasPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      setPhase(8);
      return;
    }

    setPhase(0);
    const schedule = [650, 1300, 2050, 3000, 4050, 5200, 6500, 7800];
    const timers = schedule.map((delay, index) =>
      window.setTimeout(() => setPhase(index + 1), delay)
    );
    timers.push(window.setTimeout(() => setLoopKey((value) => value + 1), 9800));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isInView, loopKey, reducedMotion]);

  const timeout: TimeoutValue = phase >= 5 ? '2h' : '24h';
  const activeView: WorkspaceView =
    phase <= 2
      ? 'source'
      : phase <= 5
        ? 'canvas'
        : phase === 6
          ? 'diff'
          : 'terminal';
  const selected: WorkspaceStep = phase >= 5 ? 'approval' : 'trigger';
  const status =
    phase >= 7
      ? 'proposal ready'
      : phase >= 5
        ? '1 synchronized change'
        : phase >= 3
          ? 'canvas generated'
          : 'reading source';

  return (
    <div ref={rootRef} className='h-full w-full bg-zinc-100 p-2 sm:p-3 dark:bg-zinc-900'>
      <div className='flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-zinc-800 bg-[#0a0a0c] shadow-[0_22px_80px_rgba(0,0,0,0.24)]'>
        <WorkspaceHeader filename='release.workflow.ts' />

        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='flex shrink-0 items-start justify-between gap-5 border-b border-white/[0.06] px-5 py-4 sm:px-7 sm:py-5'>
            <div className='min-w-0'>
              <div className='font-mono text-[8px] tracking-[0.12em] text-zinc-700 uppercase sm:text-[9px]'>
                01 · synchronized workflow
              </div>
              <div className='mt-1.5 truncate text-sm font-medium tracking-[-0.02em] text-zinc-200 sm:text-base'>
                Code and canvas stay the same workflow.
              </div>
            </div>
            <div className='hidden shrink-0 rounded-full border border-white/[0.07] px-2.5 py-1 font-mono text-[8px] text-zinc-600 sm:block'>
              commit 7f91b2d
            </div>
          </div>

          <div className='relative min-h-0 flex-1'>
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={`${activeView}-${timeout}`}
                className='absolute inset-0'
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
              >
                <WorkspaceSurface
                  view={activeView}
                  timeout={timeout}
                  selected={selected}
                  revealed={phase === 0 ? 1 : phase === 1 ? 5 : 9}
                  visible={phase <= 3 ? 2 : 5}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <WorkspaceTabs active={activeView} status={status} />
      </div>
    </div>
  );
}
