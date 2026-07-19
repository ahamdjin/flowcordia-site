import { InfiniteSlider } from '@/components/core/infinite-slider';

const foundations = [
  'GitHub',
  'Trigger.dev',
  'TypeScript',
  'PostgreSQL',
  'Docker',
  'Self-hosted',
];

export function InfiniteSliderHoverSpeed() {
  return (
    <InfiniteSlider speedOnHover={20} gap={24}>
      {foundations.map((foundation) => (
        <div
          key={foundation}
          className='flex aspect-square w-[120px] items-center justify-center rounded-[4px] border border-zinc-200 bg-white text-center text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
        >
          {foundation}
        </div>
      ))}
    </InfiniteSlider>
  );
}
