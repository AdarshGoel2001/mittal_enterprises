import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mittal Enterprises — Laboratory Scientific Instruments';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f8f7f3',
          color: '#0c0f0e',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: '#0c0f0e',
              color: '#f8f7f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 28,
            }}
          >
            M
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>Mittal Enterprises</span>
            <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2, textTransform: 'uppercase' }}>
              Est. 1976 · Delhi
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 16, color: '#0e4f4f', letterSpacing: 3, textTransform: 'uppercase' }}>
            Laboratory Scientific Instruments
          </span>
          <h1 style={{ fontSize: 84, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2, margin: 0 }}>
            Precision instruments for research that matters.
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #c8c4b7',
            paddingTop: 20,
          }}
        >
          <span style={{ fontSize: 18, color: '#2d302e' }}>
            Ultrasonic interferometers · Nanofluid apparatus · Physics & Chemistry lab instruments
          </span>
          <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2 }}>ISO 9001:2008 · FIEO</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
