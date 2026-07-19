import { TextLoop } from '@/components/core/text-loop';

export function TextLoopBasic() {
  return (
    <TextLoop className='font-mono text-sm'>
      <span>Build on the canvas</span>
      <span>Extend with typed functions</span>
      <span>Review the change in GitHub</span>
      <span>Run the exact version</span>
    </TextLoop>
  );
}
