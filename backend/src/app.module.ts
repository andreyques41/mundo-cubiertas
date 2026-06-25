import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductosModule,
    CotizacionesModule,
  ],
})
export class AppModule {}
