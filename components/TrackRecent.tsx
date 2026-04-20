'use client';

import { useEffect } from 'react';
import { recordRecentlyViewed } from './RecentlyViewed';

export default function TrackRecent({ productId }: { productId: string }) {
  useEffect(() => {
    recordRecentlyViewed(productId);
  }, [productId]);
  return null;
}
