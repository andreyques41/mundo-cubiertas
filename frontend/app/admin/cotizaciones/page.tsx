'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const ESTADOS = ['borrador', 'enviada', 'aceptada', 'rechazada', 'expirada'] as const;
type Estado = typeof ESTADOS[number];

const BADGE: Record<Estado, string> = {
  borrador:  'bg-gray-100 text-gray-600',
  enviada:   'bg-blue-100 text-blue-700',
  aceptada:  'bg-green-100 text-green-700',
  rechazada: 'bg-red-100 text-red-600',
  expirada:  'bg-yellow-100 text-yellow-700',
};

export default function AdminCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);

  const cargar = () => {
    setCargando(true);
    fetch(`${API}/admin/cotizaciones`)
      .then((r) => r.json())
      .then(setCotizaciones)
      .finally(() => setCargando(false));
  };

  useEffect(cargar, []);

  const cambiarEstado = async (id: number, estado: Estado) => {
    await fetch(`${API}/admin/cotizaciones/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    cargar();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cotizaciones</h1>

      {cargando ? (
        <p className="text-gray-400">Cargando...</p>
      ) : cotizaciones.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No hay cotizaciones aún.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">#</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Teléfono</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Planos</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {cotizaciones.map((c) => (
                <>
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandido(expandido === c.id ? null : c.id)}>
                    <td className="px-4 py-3 text-gray-500 font-mono">#{c.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.cliente?.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`https://wa.me/${c.cliente?.telefono}`} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-600 hover:underline">
                        {c.cliente?.telefono}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.tiene_planos ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        {c.tiene_planos ? 'Con planos' : 'Sin planos'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.estado}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => cambiarEstado(c.id, e.target.value as Estado)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${BADGE[c.estado as Estado] ?? ''}`}>
                        {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(c.created_at).toLocaleDateString('es-CR')}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{expandido === c.id ? '▲' : '▼'}</td>
                  </tr>

                  {expandido === c.id && (
                    <tr key={`${c.id}-detalle`} className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        {c.notas && <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Notas:</span> {c.notas}</p>}
                        {c.url_planos && <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Descripción planos:</span> {c.url_planos}</p>}
                        {c.cliente?.email && <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Email:</span> {c.cliente.email}</p>}
                        {c.items?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Productos solicitados</p>
                            <div className="flex flex-col gap-1">
                              {c.items.map((item: any) => (
                                <p key={item.id} className="text-sm text-gray-700">
                                  • {item.producto?.nombre} — {item.cantidad} {item.unidad} × ₡{Number(item.precio_unitario).toLocaleString('es-CR')} = ₡{Number(item.subtotal).toLocaleString('es-CR')}
                                </p>
                              ))}
                            </div>
                            {c.total && <p className="text-sm font-semibold text-gray-800 mt-2">Total: ₡{Number(c.total).toLocaleString('es-CR')}</p>}
                          </div>
                        )}
                        {!c.items?.length && !c.notas && !c.url_planos && (
                          <p className="text-sm text-gray-400">Sin detalles adicionales.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
