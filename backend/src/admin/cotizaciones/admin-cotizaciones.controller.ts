import { Body, Controller, Get, Param, ParseIntPipe, Patch, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AdminCotizacionesService } from './admin-cotizaciones.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Controller('admin/cotizaciones')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AdminCotizacionesController {
  constructor(private readonly service: AdminCotizacionesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id/pdf')
  async descargarPDF(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const buffer = await this.service.generarPDF(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cotizacion-${id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: CambiarEstadoDto) {
    return this.service.cambiarEstado(id, dto);
  }
}
