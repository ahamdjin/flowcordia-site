import { ImageResponse } from 'next/og';

export const alt = 'Flowcordia — build in code and operate visually.';
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
          <div style={{ maxWidth: '940px', fontSize: 72, lineHeight: 1.04, fontWeight: 600 }}>
            Build in code. Operate visually.
          </div>
          <div style={{ maxWidth: '860px', fontSize: 28, lineHeight: 1.35, color: '#52525b' }}>
            Open-source infrastructure for durable workflows in real code, with a visual operating layer for teams.
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#71717a' }}>Open source · Self-hostable · Git-native</div>
      </div>
    ),
    size
  );
}
