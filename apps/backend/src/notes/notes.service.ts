import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, data: any) {
    return this.prisma.note.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.note.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.note.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
