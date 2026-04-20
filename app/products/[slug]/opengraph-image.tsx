import { ImageResponse } from 'next/og';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

export const alt = 'Product category — Mittal Enterprises';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const category = productCategories.find((c) => c.slug === params.slug);
  return [{
    id: 'category',
    alt: category ? `${category.name} — Mittal Enterprises` : alt,
    contentType,
    size,
  }];
}

export default async function OG({ params }: { params: { slug: string } }) {
  const category = productCategories.find((c) => c.slug === params.slug);
  if (!category) return new Response('Not found', { status: 404 });

  const count = products.filter((p) => p.categoryId === category.id).length;

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
          <div style={{ width: 52, height: 52, background: '#0c0f0e', color: '#f8f7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 28 }}>
            M
          </div>
          <span style={{ fontSize: 22, fontWeight: 600 }}>Mittal Enterprises</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={{ fontSize: 16, color: '#0e4f4f', letterSpacing: 3, textTransform: 'uppercase' }}>
            Product category · {count} {count === 1 ? 'instrument' : 'instruments'}
          </span>
          <h1 style={{ fontSize: 80, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, margin: 0, maxWidth: 1000 }}>
            {category.name}
          </h1>
          <p style={{ fontSize: 22, color: '#2d302e', lineHeight: 1.4, margin: 0, maxWidth: 900 }}>
            {category.description}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #c8c4b7', paddingTop: 20 }}>
          <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2, textTransform: 'uppercase' }}>Est. 1976 · Delhi</span>
          <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2 }}>mittalenterprises.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
