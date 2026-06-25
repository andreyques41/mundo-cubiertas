import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';

@Injectable()
export class CotizacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearCotizacionDto) {
    const cliente = await this.prisma.cliente.create({
      data: {
        nombre: dto.nombre_cliente,
        telefono: dto.telefono,
        empresa: dto.empresa,
        email: dto.email,
        tiene_planos: dto.tiene_planos,
      },
    });

    const cotizacion = await this.prisma.cotizacion.create({
      data: {
        cliente_id: cliente.id,
        tiene_planos: dto.tiene_planos,
        url_planos: dto.descripcion_planos ?? null,
        notas: dto.notas,
        estado: 'borrador',
        items: dto.items?.length
          ? {
              create: await Promise.all(
                dto.items.map(async (item) => {
                  const producto = await this.prisma.producto.findUniqueOrThrow({
                    where: { id: item.producto_id },
                  });
                  const subtotal = Number(producto.precio_referencia) * item.cantidad;
                  return {
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    unidad: item.unidad,
                    precio_unitario: producto.precio_referencia,
                    subtotal,
                  };
                }),
              ),
            }
          : undefined,
      },
      include: { items: true, cliente: true },
    });

    return cotizacion;
  }

  findOne(id: number) {
    return this.prisma.cotizacion.findUnique({
      where: { id },
      include: { items: { include: { producto: true } }, cliente: true },
    });
  }
}
