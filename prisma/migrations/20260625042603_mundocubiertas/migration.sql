-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('borrador', 'enviada', 'aceptada', 'rechazada', 'expirada');

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_referencia" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT NOT NULL DEFAULT 'm2',
    "imagen_url" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT,
    "email" TEXT,
    "telefono" TEXT NOT NULL,
    "tiene_planos" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'borrador',
    "tiene_planos" BOOLEAN NOT NULL DEFAULT false,
    "url_planos" TEXT,
    "total" DECIMAL(10,2),
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizacion_items" (
    "id" SERIAL NOT NULL,
    "cotizacion_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cotizacion_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
