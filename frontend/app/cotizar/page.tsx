'use client';

import { useState } from 'react';
import Link from 'next/link';

type Paso = 'tiene_planos' | 'formulario' | 'confirmacion';

interface FormData {
  nombre_cliente: string;
  telefono: string;
  empresa: string;
  email: string;
  tiene_planos: boolean | null;
  descripcion_planos: string;
  tipo_uso: string;
  metros_estimados: string;
  notas: string;
}

const estadoInicial: FormData = {
  nombre_cliente: '',
  telefono: '',
  empresa: '',
  email: '',
  tiene_planos: null,
  descripcion_planos: '',
  tipo_uso: '',
  metros_estimados: '',
  notas: '',
};

export default function CotizarPage() {
  const [paso, setPaso] = useState<Paso>('tiene_planos');
  const [form, setForm] = useState<FormData>(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [referencia, setReferencia] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

    try {
      const body = {
        nombre_cliente: form.nombre_cliente,
        telefono: form.telefono,
        empresa: form.empresa || undefined,
        email: form.email || undefined,
        tiene_planos: form.tiene_planos,
        descripcion_planos: form.tiene_planos ? form.descripcion_planos : undefined,
        notas: form.tiene_planos
          ? form.notas
          : `Tipo de uso: ${form.tipo_uso}. Metros estimados: ${form.metros_estimados}. ${form.notas}`.trim(),
      };

      const res = await fetch(`${apiUrl}/cotizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Error al enviar la cotización');
      }

      const data = await res.json();
      setReferencia(data.id);
      setPaso('confirmacion');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setEnviando(false);
    }
  }

  if (paso === 'confirmacion') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm border">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Cotización recibida!
          </h1>
          <p className="text-gray-600 mb-1">
            Tu número de referencia es:
          </p>
          <p className="text-3xl font-bold text-green-600 mb-6">#{referencia}</p>
          <p className="text-sm text-gray-500 mb-6">
            Un vendedor revisará tu solicitud y te contactará pronto al número que indicaste.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Ver más productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Solicitar cotización</h1>

        {/* Paso 1: ¿Tiene planos? */}
        {paso === 'tiene_planos' && (
          <div className="bg-white rounded-2xl p-8 border mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ¿Cuentas con planos del proyecto?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Esto nos ayuda a darte una cotización más precisa.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { set('tiene_planos', true); setPaso('formulario'); }}
                className="w-full border-2 border-green-600 text-green-700 font-semibold py-4 rounded-xl hover:bg-green-50 transition text-left px-5"
              >
                ✅ Sí, tengo planos
                <span className="block text-xs font-normal text-gray-500 mt-1">
                  Te pediremos que describas o compartas los detalles del plano.
                </span>
              </button>
              <button
                onClick={() => { set('tiene_planos', false); setPaso('formulario'); }}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition text-left px-5"
              >
                📐 No, solo tengo estimados
                <span className="block text-xs font-normal text-gray-500 mt-1">
                  Te cotizamos con precio de referencia. Puede variar según la medición final.
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Formulario */}
        {paso === 'formulario' && (
          <form onSubmit={enviar} className="bg-white rounded-2xl p-8 border mt-6 flex flex-col gap-5">
            <div>
              <p className="text-sm font-medium text-green-700 mb-4">
                {form.tiene_planos ? '✅ Cotización con planos' : '📐 Cotización sin planos (precio referencial)'}
                <button
                  type="button"
                  onClick={() => setPaso('tiene_planos')}
                  className="ml-2 text-gray-400 hover:text-gray-600 underline text-xs"
                >
                  Cambiar
                </button>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.nombre_cliente}
                onChange={(e) => set('nombre_cliente', e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: 8888-8888"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  value={form.empresa}
                  onChange={(e) => set('empresa', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Ruta A: con planos */}
            {form.tiene_planos && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de los planos <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.descripcion_planos}
                  onChange={(e) => set('descripcion_planos', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe los planos o comparte un enlace (Google Drive, etc.). En la próxima fase podrás subir el archivo directamente."
                />
              </div>
            )}

            {/* Ruta B: sin planos */}
            {form.tiene_planos === false && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de uso <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.tipo_uso}
                    onChange={(e) => set('tipo_uso', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="casa">Casa / residencia</option>
                    <option value="bodega">Bodega / industrial</option>
                    <option value="comercial">Local comercial</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metros cuadrados estimados <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.metros_estimados}
                    onChange={(e) => set('metros_estimados', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: 120"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                rows={2}
                value={form.notas}
                onChange={(e) => set('notas', e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Cualquier detalle adicional del proyecto"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Solicitar cotización'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
