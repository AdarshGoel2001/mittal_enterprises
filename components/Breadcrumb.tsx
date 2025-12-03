import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="text-gray-600 hover:text-[#3685d2]">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-gray-400">»</span>
            {index === items.length - 1 ? (
              <span className="text-gray-800">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-gray-600 hover:text-[#3685d2]">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
