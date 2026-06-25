import { IsEnum } from 'class-validator';
import { EstadoCotizacion } from '@prisma/client';

export class CambiarEstadoDto {
  @IsEnum(EstadoCotizacion)
  estado: EstadoCotizacion;
}
