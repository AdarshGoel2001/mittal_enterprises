import Image from 'next/image';
import Link from 'next/link';
import { ProductCategory } from '@/lib/data';

export default function ProductCard({ product }: { product: ProductCategory }) {
  return (
    <div className="bg-white shadow-lg p-4 text-center min-h-[480px] flex flex-col">
      <h3 className="text-xl font-semibold py-4">{product.name}</h3>
      <div className="relative w-full h-48 mb-4 overflow-hidden group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-125"
        />
      </div>
      <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
      {product.fullDescription && (
        <p className="text-gray-700 mb-4">{product.fullDescription}</p>
      )}
      <Link
        href={`/products/${product.slug}`}
        className="bg-[#01c2c7] text-white py-4 px-8 inline-block hover:bg-[#3685d2] transition-colors mt-auto"
      >
        View More
      </Link>
    </div>
  );
}
