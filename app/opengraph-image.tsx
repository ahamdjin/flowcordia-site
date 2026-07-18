import { ImageResponse } from 'next/og';

export const alt = 'Flowcordia — build workflows visually and govern them like code.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          color: '#18181b',
          padding: '72px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Flowcordia</div>
          <div
            style={{
              display: 'flex',
              borderRadius: '6px',
              background: '#27272a',
              color: '#ffffff',
              padding: '7px 12px',
              fontSize: 18,
            }}
          >
            alpha
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <div style={{ maxWidth: '940px', fontSize: 68, lineHeight: 1.05, fontWeight: 600 }}>
            Build workflows visually. Govern them like code.
          </div>
          <div style={{ maxWidth: '850px', fontSize: 28, lineHeight: 1.35, color: '#52525b' }}>
            A Git-native workflow platform connecting Studio, typed functions, reviewed changes, and exact-version execution.
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#71717a' }}>Open source · Built in public</div>
      </div>
    ),
    size
  );
}
