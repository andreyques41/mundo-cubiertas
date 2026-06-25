import Link from 'next/link';

export default function LandingPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '50600000000';

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-900 text-white px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Mundo Cubiertas</h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
          Cubiertas metálicas, techos, fachadas, láminas y paneles.
          Soluciones profesionales para proyectos residenciales e industriales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/productos"
            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Ver catálogo
          </Link>
          <Link
            href="/cotizar"
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Solicitar cotización
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Nuestros productos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {[
            'Cubiertas metálicas',
            'Láminas UPVC',
            'Paneles',
            'Fachadas',
            'Accesorios',
            'Ojalatera',
          ].map((cat) => (
            <Link
              key={cat}
              href={`/productos?categoria=${encodeURIComponent(cat)}`}
              className="border rounded-xl p-5 text-center text-gray-700 font-medium hover:border-green-600 hover:text-green-700 transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-green-50 px-6 py-12 text-center">
        <p className="text-gray-700 mb-4 text-lg">
          ¿Preguntas rápidas? Escríbenos directo por WhatsApp.
        </p>
        <a
          href={`https://wa.me/${waNumber}?text=Hola%2C%20me%20interesa%20información%20sobre%20sus%20productos.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Contactar por WhatsApp
        </a>
      </section>
    </main>
  );
}
