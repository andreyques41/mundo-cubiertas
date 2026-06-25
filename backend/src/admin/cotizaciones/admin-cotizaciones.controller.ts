import { Body, Controller, Get, Param, ParseIntPipe, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminCotizacionesService } from './admin-cotizaciones.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@Controller('admin/cotizaciones')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AdminCotizacionesController {
  constructor(private readonly service: AdminCotizacionesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Patch(':id/estado')
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: CambiarEstadoDto) {
    return this.service.cambiarEstado(id, dto);
  }
}
