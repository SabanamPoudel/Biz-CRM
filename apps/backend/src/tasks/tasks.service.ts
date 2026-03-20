import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: any) {
    return this.prisma.task.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.task.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
