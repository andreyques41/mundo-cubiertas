import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  precio_referencia: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
