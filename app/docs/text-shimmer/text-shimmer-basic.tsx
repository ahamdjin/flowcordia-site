import { PolicyLoomWorkflow } from '@/components/website/policy-loom-workflow';

export function TextShimmerBasic() {
  return (
    <>
      <style>{`
        .flowcordia-card-eight {
          height: 860px;
          width: calc(100% + 4rem);
          margin-left: -2rem;
        }

        div:has(> .flowcordia-card-eight) {
          height: 860px !important;
          align-items: stretch !important;
          justify-content: stretch !important;
        }

        @media (min-width: 768px) {
          .flowcordia-card-eight {
            height: 610px;
            width: calc(100% + 10rem);
            margin-left: -5rem;
          }

          div:has(> .flowcordia-card-eight) {
            height: 610px !important;
          }
        }
      `}</style>
      <div className='flowcordia-card-eight'>
        <PolicyLoomWorkflow />
      </div>
    </>
  );
}
