'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio_referencia: string;
  unidad: string;
  activo: boolean;
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    setCargando(true);
    fetch(`${API}/admin/productos`)
      .then((r) => r.json())
      .then(setProductos)
      .finally(() => setCargando(false));
  };

  useEffect(cargar, []);

  const desactivar = async (id: number, nombre: string) => {
    if (!confirm(`¿Desactivar "${nombre}"? No aparecerá en el catálogo público.`)) return;
    await fetch(`${API}/admin/productos/${id}`, { method: 'DELETE' });
    cargar();
  };

  const reactivar = async (id: number) => {
    await fetch(`${API}/admin/productos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: true }),
    });
    cargar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <Link href="/admin/productos/nuevo" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
          + Nuevo producto
        </Link>
      </div>

      {cargando ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Categoría</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Precio ref.</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Unidad</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {productos.map((p) => (
                <tr key={p.id} className={p.activo ? '' : 'opacity-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{p.categoria}</td>
                  <td className="px-4 py-3 text-gray-800">
                    ₡{Number(p.precio_referencia).toLocaleString('es-CR')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.unidad}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/productos/${p.id}`} className="text-blue-600 hover:underline text-xs font-medium">
                        Editar
                      </Link>
                      {p.activo ? (
                        <button onClick={() => desactivar(p.id, p.nombre)} className="text-red-500 hover:underline text-xs font-medium">
                          Desactivar
                        </button>
                      ) : (
                        <button onClick={() => reactivar(p.id)} className="text-green-600 hover:underline text-xs font-medium">
                          Reactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <p className="text-center text-gray-400 py-12">No hay productos aún.</p>
          )}
        </div>
      )}
    </div>
  );
}
