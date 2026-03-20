import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompanyTypesService {
  constructor(private prisma: PrismaService) {}

  async createCompanyType(data: {
    name: string;
    slug: string;
    description?: string;
    advantages?: string[];
    disadvantages?: string[];
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return this.prisma.companyType.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        advantages: data.advantages || [],
        disadvantages: data.disadvantages || [],
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
      include: {
        servicePricing: true,
        plans: true,
      },
    });
  }

  async getAllCompanyTypes() {
    return this.prisma.companyType.findMany({
      include: {
        servicePricing: true,
        plans: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCompanyTypeById(id: number) {
    return this.prisma.companyType.findUnique({
      where: { id },
      include: {
        servicePricing: true,
        plans: true,
      },
    });
  }

  async updateCompanyType(id: number, data: any) {
    return this.prisma.companyType.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        advantages: data.advantages,
        disadvantages: data.disadvantages,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
      include: {
        servicePricing: true,
        plans: true,
      },
    });
  }

  async deleteCompanyType(id: number) {
    return this.prisma.companyType.delete({
      where: { id },
    });
  }
}
