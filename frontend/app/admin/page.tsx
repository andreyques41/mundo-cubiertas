'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function AdminDashboard() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/productos`).then((r) => r.json()),
      fetch(`${API}/admin/cotizaciones`).then((r) => r.json()),
    ])
      .then(([p, c]) => { setProductos(p); setCotizaciones(c); })
      .finally(() => setCargando(false));
  }, []);

  const estadoCount = (estado: string) => cotizaciones.filter((c) => c.estado === estado).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {cargando ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat label="Productos activos" value={productos.filter((p) => p.activo).length} href="/admin/productos" color="green" />
          <Stat label="Cotizaciones" value={cotizaciones.length} href="/admin/cotizaciones" color="blue" />
          <Stat label="En revisión" value={estadoCount('borrador')} href="/admin/cotizaciones" color="yellow" />
          <Stat label="Aceptadas" value={estadoCount('aceptada')} href="/admin/cotizaciones" color="green" />
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/admin/productos/nuevo" className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
          + Agregar producto
        </Link>
        <Link href="/admin/cotizaciones" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
          Ver cotizaciones
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, href, color }: { label: string; value: number; href: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
  };
  return (
    <Link href={href} className="bg-white border rounded-xl p-5 hover:border-green-400 transition">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[color] ?? 'text-gray-800'}`}>{value}</p>
    </Link>
  );
}
