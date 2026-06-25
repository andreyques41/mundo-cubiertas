import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Injectable()
export class AdminCotizacionesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cotizacion.findMany({
      include: { cliente: true, items: { include: { producto: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async cambiarEstado(id: number, dto: CambiarEstadoDto) {
    const c = await this.prisma.cotizacion.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Cotizacion ${id} no encontrada`);
    return this.prisma.cotizacion.update({ where: { id }, data: { estado: dto.estado } });
  }
}
