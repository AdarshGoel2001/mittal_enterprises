import Image from 'next/image';
import Link from 'next/link';
import { ProductCategory } from '@/lib/data';

export default function ProductCard({ product, index }: { product: ProductCategory; index?: number }) {
  const n = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col h-full bg-surface transition-colors duration-200 hover:bg-paper"
    >
      <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10" />
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        {n && <p className="mono text-[0.7rem] text-ink-muted tracking-widest uppercase mb-3 group-hover:text-accent transition-colors">Category {n}</p>}
        <h3 className="text-lg md:text-xl font-semibold tracking-tight text-ink mb-2 leading-snug min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 mb-5">
          {product.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 text-sm text-ink font-medium group-hover:gap-3 transition-all">
          View instruments
          <span aria-hidden className="group-hover:text-accent transition-colors">→</span>
        </span>
      </div>
    </Link>
  );
}
