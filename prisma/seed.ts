import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productos = [
    { nombre: 'Lámina metálica R-101', categoria: 'Cubiertas metálicas', descripcion: 'Lámina de acero galvanizado calibre 26, perfil R-101. Ideal para techos residenciales e industriales.', precio_referencia: 4500, unidad: 'm2' },
    { nombre: 'Lámina UPVC traslúcida', categoria: 'Láminas UPVC', descripcion: 'Lámina plástica translúcida resistente a UV. Permite el paso de luz natural sin calor excesivo.', precio_referencia: 6200, unidad: 'm2' },
    { nombre: 'Panel sándwich 50mm', categoria: 'Paneles', descripcion: 'Panel de doble cara metálica con núcleo de poliuretano. Excelente aislamiento térmico y acústico.', precio_referencia: 18500, unidad: 'm2' },
    { nombre: 'Lámina de zinc ondulada', categoria: 'Cubiertas metálicas', descripcion: 'Lámina de zinc ondulada calibre 28. Liviana y fácil de instalar.', precio_referencia: 3800, unidad: 'm2' },
    { nombre: 'Perfil de fachada tipo A', categoria: 'Fachadas', descripcion: 'Perfil metálico para revestimiento de fachadas. Acabado en pintura electroestática blanco humo.', precio_referencia: 9200, unidad: 'm2' },
    { nombre: 'Kit de tornillos y sellos', categoria: 'Ojalatera', descripcion: 'Kit completo de fijación para láminas metálicas. Incluye 100 tornillos autoperforantes y sellos EPDM.', precio_referencia: 12500, unidad: 'kit' },
  ];

  for (const p of productos) {
    await prisma.producto.upsert({
      where: { id: productos.indexOf(p) + 1 },
      update: p,
      create: p,
    });
  }

  console.log(`Seed completado: ${productos.length} productos creados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
