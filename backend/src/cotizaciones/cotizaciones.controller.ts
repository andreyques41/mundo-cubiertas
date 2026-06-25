import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';

@Controller('cotizaciones')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  crear(@Body() dto: CrearCotizacionDto) {
    return this.cotizacionesService.crear(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const cotizacion = await this.cotizacionesService.findOne(id);
    if (!cotizacion) throw new NotFoundException(`Cotizacion ${id} no encontrada`);
    return cotizacion;
  }
}
