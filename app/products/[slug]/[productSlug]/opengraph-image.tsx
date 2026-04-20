import { ImageResponse } from 'next/og';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

export const alt = 'Product — Mittal Enterprises';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { slug: string; productSlug: string } }) {
  const product = products.find((p) => p.slug === params.productSlug);
  return [{
    id: 'product',
    alt: product ? `${product.name} — Mittal Enterprises` : alt,
    contentType,
    size,
  }];
}

export default async function OG({ params }: { params: { slug: string; productSlug: string } }) {
  const product = products.find((p) => p.slug === params.productSlug);
  const category = product ? productCategories.find((c) => c.id === product.categoryId) : null;
  if (!product || !category) return new Response('Not found', { status: 404 });

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, background: '#0c0f0e', color: '#f8f7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 28 }}>
              M
            </div>
            <span style={{ fontSize: 22, fontWeight: 600 }}>Mittal Enterprises</span>
          </div>
          <span
            style={{
              fontSize: 18,
              fontFamily: 'ui-monospace, monospace',
              border: '1px solid #c8c4b7',
              padding: '8px 14px',
              background: '#ffffff',
              letterSpacing: 2,
            }}
          >
            {product.itemCode}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 16, color: '#0e4f4f', letterSpacing: 3, textTransform: 'uppercase' }}>
            {category.name}
          </span>
          <h1 style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, margin: 0, maxWidth: 1050 }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 22, color: '#2d302e', lineHeight: 1.4, margin: 0, maxWidth: 950 }}>
            {product.description}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #c8c4b7', paddingTop: 20 }}>
          <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2, textTransform: 'uppercase' }}>Request a quote · mittalenterprises.com</span>
          <span style={{ fontSize: 14, color: '#6a6a66', letterSpacing: 2 }}>ISO 9001:2008 · FIEO</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
