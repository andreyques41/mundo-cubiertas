import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemCotizacionDto {
  @IsNumber()
  @IsPositive()
  producto_id: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  unidad: string;
}

export class CrearCotizacionDto {
  @IsString()
  @IsNotEmpty()
  nombre_cliente: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsBoolean()
  tiene_planos: boolean;

  @ValidateIf((o) => o.tiene_planos === true)
  @IsString()
  @IsNotEmpty()
  descripcion_planos?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCotizacionDto)
  items?: ItemCotizacionDto[];
}
