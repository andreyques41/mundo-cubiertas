import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.producto.findMany({
      where: { activo: true },
      orderBy: { categoria: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.producto.findFirst({
      where: { id, activo: true },
    });
  }
}
