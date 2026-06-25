import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { CotizacionPDF } from './cotizacion-pdf';
import { EmailService } from './email.service';

@Injectable()
export class AdminCotizacionesService {
  private readonly logger = new Logger(AdminCotizacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  findAll() {
    return this.prisma.cotizacion.findMany({
      include: { cliente: true, items: { include: { producto: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async cambiarEstado(id: number, dto: CambiarEstadoDto) {
    const cotizacion = await this.prisma.cotizacion.findUnique({
      where: { id },
      include: { cliente: true, items: { include: { producto: true } } },
    });
    if (!cotizacion) throw new NotFoundException(`Cotizacion ${id} no encontrada`);

    const updated = await this.prisma.cotizacion.update({ where: { id }, data: { estado: dto.estado } });

    if (dto.estado === 'enviada' && cotizacion.cliente?.email) {
      try {
        const pdfBuffer = await this.generarPDFDesde(cotizacion);
        await this.email.enviarCotizacion({
          destinatario: cotizacion.cliente.email,
          nombreCliente: cotizacion.cliente.nombre,
          idCotizacion: id,
          pdfBuffer,
        });
      } catch (err) {
        this.logger.error(`No se pudo enviar email para cotización #${id}: ${err.message}`);
      }
    }

    return updated;
  }

  async generarPDF(id: number): Promise<Buffer> {
    const cotizacion = await this.prisma.cotizacion.findUnique({
      where: { id },
      include: { cliente: true, items: { include: { producto: true } } },
    });
    if (!cotizacion) throw new NotFoundException(`Cotizacion ${id} no encontrada`);
    return this.generarPDFDesde(cotizacion);
  }

  private generarPDFDesde(cotizacion: any): Promise<Buffer> {
    const element = React.createElement(CotizacionPDF, { cotizacion });
    return renderToBuffer(element as any) as Promise<Buffer>;
  }
}
