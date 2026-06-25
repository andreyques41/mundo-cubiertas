import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { CotizacionPDF } from './cotizacion-pdf';

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

  async generarPDF(id: number): Promise<Buffer> {
    const cotizacion = await this.prisma.cotizacion.findUnique({
      where: { id },
      include: { cliente: true, items: { include: { producto: true } } },
    });
    if (!cotizacion) throw new NotFoundException(`Cotizacion ${id} no encontrada`);

    const element = React.createElement(CotizacionPDF, { cotizacion });
    return renderToBuffer(element) as Promise<Buffer>;
  }
}
