import { Module } from '@nestjs/common';
import { AdminProductosController } from './productos/admin-productos.controller';
import { AdminProductosService } from './productos/admin-productos.service';
import { AdminCotizacionesController } from './cotizaciones/admin-cotizaciones.controller';
import { AdminCotizacionesService } from './cotizaciones/admin-cotizaciones.service';
import { EmailService } from './cotizaciones/email.service';

@Module({
  controllers: [AdminProductosController, AdminCotizacionesController],
  providers: [AdminProductosService, AdminCotizacionesService, EmailService],
})
export class AdminModule {}
