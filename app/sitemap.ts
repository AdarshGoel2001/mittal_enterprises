import type { MetadataRoute } from 'next';
import { productCategories } from '@/lib/data';
import { products } from '@/lib/products-data';

const BASE_URL = 'https://www.mittalenterprises.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/profile`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/global-supplies`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/enquiry`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = productCategories.map((c) => ({
    url: `${BASE_URL}/products/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((p) => {
    const cat = productCategories.find((c) => c.id === p.categoryId);
    if (!cat) return [];
    return [{
      url: `${BASE_URL}/products/${cat.slug}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }];
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
