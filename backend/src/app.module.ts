import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    PrismaModule,
    ProductosModule,
    CotizacionesModule,
    AdminModule,
  ],
})
export class AppModule {}
