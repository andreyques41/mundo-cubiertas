'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  precio_referencia: string;
  unidad: string;
  imagen_url: string | null;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '50600000000';

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    fetch(`${apiUrl}/productos`)
      .then((r) => r.json())
      .then(setProductos)
      .catch(console.error)
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando productos...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Catálogo de productos</h1>
          <Link href="/cotizar" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
            Solicitar cotización
          </Link>
        </div>

        {productos.length === 0 ? (
          <p className="text-gray-500 text-center py-20">
            No hay productos disponibles por el momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border p-5 flex flex-col gap-3">
                {p.imagen_url && (
                  <img
                    src={p.imagen_url}
                    alt={p.nombre}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
                  {p.categoria}
                </span>
                <h2 className="text-lg font-semibold text-gray-800">{p.nombre}</h2>
                {p.descripcion && (
                  <p className="text-sm text-gray-500 flex-1">{p.descripcion}</p>
                )}
                <p className="text-sm text-gray-600">
                  Precio referencia:{' '}
                  <span className="font-semibold text-gray-800">
                    ₡{Number(p.precio_referencia).toLocaleString('es-CR')} / {p.unidad}
                  </span>
                </p>
                <div className="flex gap-2 mt-1">
                  <Link
                    href={`/cotizar?producto=${p.id}`}
                    className="flex-1 text-center text-sm bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Cotizar
                  </Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=Hola%2C%20me%20interesa%20cotizar%20*${encodeURIComponent(p.nombre)}*`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-sm border border-green-600 text-green-700 py-2 rounded-lg hover:bg-green-50 transition"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
