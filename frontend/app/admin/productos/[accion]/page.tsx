'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const CATEGORIAS = ['Cubiertas metálicas', 'Láminas UPVC', 'Paneles', 'Fachadas', 'Accesorios', 'Ojalatera'];

const VACIO = { nombre: '', categoria: '', descripcion: '', precio_referencia: '', unidad: 'm2', imagen_url: '', activo: true };

export default function FormProductoPage() {
  const params = useParams();
  const router = useRouter();
  const accion = params.accion as string;

  const esEdicion = accion !== 'nuevo';
  const id = esEdicion ? accion : null;

  const [form, setForm] = useState(VACIO);
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!esEdicion) return;
    fetch(`${API}/admin/productos/${id}`)
      .then((r) => r.json())
      .then((p) => setForm({ nombre: p.nombre, categoria: p.categoria, descripcion: p.descripcion ?? '', precio_referencia: String(p.precio_referencia), unidad: p.unidad, imagen_url: p.imagen_url ?? '', activo: p.activo }))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const body = {
      nombre: form.nombre,
      categoria: form.categoria,
      descripcion: form.descripcion || undefined,
      precio_referencia: Number(form.precio_referencia),
      unidad: form.unidad,
      imagen_url: form.imagen_url || undefined,
      activo: form.activo,
    };

    try {
      const res = await fetch(`${API}/admin/productos${esEdicion ? `/${id}` : ''}`, {
        method: esEdicion ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      }
      router.push('/admin/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/productos" className="text-sm text-gray-400 hover:text-gray-600">← Productos</Link>
        <h1 className="text-2xl font-bold text-gray-800">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      <form onSubmit={guardar} className="bg-white rounded-xl border p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input required value={form.nombre} onChange={(e) => set('nombre', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Lámina metálica R-101" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
            <select required value={form.categoria} onChange={(e) => set('categoria', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
            <select value={form.unidad} onChange={(e) => set('unidad', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="m2">m²</option>
              <option value="ml">ml</option>
              <option value="unidad">unidad</option>
              <option value="kit">kit</option>
              <option value="rollo">rollo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio de referencia (₡) <span className="text-red-500">*</span></label>
            <input required type="number" min="0" step="0.01" value={form.precio_referencia}
              onChange={(e) => set('precio_referencia', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 4500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select value={form.activo ? 'true' : 'false'} onChange={(e) => set('activo', e.target.value === 'true')}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="true">Activo (visible en catálogo)</option>
              <option value="false">Inactivo (oculto)</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea rows={3} value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Descripción opcional del producto" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input value={form.imagen_url} onChange={(e) => set('imagen_url', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://... (opcional)" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={guardando}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link href="/admin/productos" className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
