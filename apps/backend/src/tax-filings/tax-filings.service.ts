import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaxFilingsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: any) {
    return this.prisma.taxFiling.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.taxFiling.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.taxFiling.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.taxFiling.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.taxFiling.delete({
      where: { id },
    });
  }
}
