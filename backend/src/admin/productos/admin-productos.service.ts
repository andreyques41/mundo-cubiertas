import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class AdminProductosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.producto.findMany({ orderBy: [{ activo: 'desc' }, { categoria: 'asc' }, { nombre: 'asc' }] });
  }

  findOne(id: number) {
    return this.prisma.producto.findUnique({ where: { id } });
  }

  crear(dto: CrearProductoDto) {
    return this.prisma.producto.create({
      data: { ...dto, unidad: dto.unidad ?? 'm2', activo: dto.activo ?? true },
    });
  }

  async actualizar(id: number, dto: ActualizarProductoDto) {
    await this.verificarExiste(id);
    return this.prisma.producto.update({ where: { id }, data: dto });
  }

  async desactivar(id: number) {
    await this.verificarExiste(id);
    return this.prisma.producto.update({ where: { id }, data: { activo: false } });
  }

  private async verificarExiste(id: number) {
    const p = await this.prisma.producto.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Producto ${id} no encontrado`);
  }
}
