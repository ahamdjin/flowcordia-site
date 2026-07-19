import { TextShimmer } from '@/components/core/text-shimmer';

export function TextShimmerBasic() {
  return (
    <TextShimmer className='font-mono text-sm' duration={1}>
      Building exact preview...
    </TextShimmer>
  );
}
