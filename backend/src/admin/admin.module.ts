import { Module } from '@nestjs/common';
import { AdminProductosController } from './productos/admin-productos.controller';
import { AdminProductosService } from './productos/admin-productos.service';
import { AdminCotizacionesController } from './cotizaciones/admin-cotizaciones.controller';
import { AdminCotizacionesService } from './cotizaciones/admin-cotizaciones.service';

@Module({
  controllers: [AdminProductosController, AdminCotizacionesController],
  providers: [AdminProductosService, AdminCotizacionesService],
})
export class AdminModule {}
