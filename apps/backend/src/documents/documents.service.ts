import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: any) {
    return this.prisma.document.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.document.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.document.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
