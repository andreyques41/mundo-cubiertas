'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/cotizaciones', label: 'Cotizaciones' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">Mundo Cubiertas</span>
          <span className="ml-3 text-xs bg-yellow-500 text-gray-900 font-semibold px-2 py-0.5 rounded">
            Panel Admin
          </span>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
          Ver sitio público →
        </Link>
      </header>

      <div className="flex flex-1">
        <nav className="w-48 bg-white border-r px-4 py-6 flex flex-col gap-1 shrink-0">
          {nav.map((item) => {
            const active = item.href === '/admin' ? path === '/admin' : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
