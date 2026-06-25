import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productosService.findOne(id);
    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }
}
