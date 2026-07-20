import { FunctionWorkbench } from '@/components/website/function-workbench';

export function TextLoopBasic() {
  return (
    <>
      <style>{`
        .flowcordia-card-seven {
          height: 820px;
          width: calc(100% + 4rem);
          margin-left: -2rem;
        }

        div:has(> .flowcordia-card-seven) {
          height: 820px !important;
          align-items: stretch !important;
          justify-content: stretch !important;
        }

        @media (min-width: 768px) {
          .flowcordia-card-seven {
            height: 590px;
            width: calc(100% + 10rem);
            margin-left: -5rem;
          }

          div:has(> .flowcordia-card-seven) {
            height: 590px !important;
          }
        }
      `}</style>
      <div className='flowcordia-card-seven'>
        <FunctionWorkbench />
      </div>
    </>
  );
}
