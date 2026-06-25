import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminProductosService } from './admin-productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Controller('admin/productos')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AdminProductosController {
  constructor(private readonly service: AdminProductosService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post()
  crear(@Body() dto: CrearProductoDto) { return this.service.crear(dto); }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarProductoDto) {
    return this.service.actualizar(id, dto);
  }

  @Delete(':id')
  desactivar(@Param('id', ParseIntPipe) id: number) { return this.service.desactivar(id); }
}
