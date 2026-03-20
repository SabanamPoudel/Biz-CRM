import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async createPlan(data: {
    name: string;
    slug: string;
    description?: string;
    type?: 'BASE' | 'ADDON';
    monthlyPriceCents?: number;
    yearlyPriceCents?: number;
    yearlyDiscountPercent?: number;
    companyTypeId?: number;
    isPopular?: boolean;
    isActive?: boolean;
    sortOrder?: number;
    serviceIds?: number[];
  }) {
    const plan = await this.prisma.plan.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type || 'BASE',
        monthlyPriceCents: data.monthlyPriceCents ?? 0,
        yearlyPriceCents: data.yearlyPriceCents ?? 0,
        yearlyDiscountPercent: data.yearlyDiscountPercent ?? 20,
        companyTypeId: data.companyTypeId,
        isPopular: data.isPopular ?? false,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: {
        planServices: { include: { service: true } },
        companyType: true,
      },
    });

    // Add services if provided
    if (data.serviceIds && data.serviceIds.length > 0) {
      for (const serviceId of data.serviceIds) {
        await this.prisma.planService.create({
          data: {
            planId: plan.id,
            serviceId,
          },
        });
      }
    }

    return this.getPlanById(plan.id);
  }

  async getAllPlans() {
    return this.prisma.plan.findMany({
      include: {
        planServices: { include: { service: true } },
        companyType: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getPlanById(id: number) {
    return this.prisma.plan.findUnique({
      where: { id },
      include: {
        planServices: { include: { service: true } },
        companyType: true,
      },
    });
  }

  async updatePlan(id: number, data: any) {
    const plan = await this.prisma.plan.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        monthlyPriceCents: data.monthlyPriceCents,
        yearlyPriceCents: data.yearlyPriceCents,
        yearlyDiscountPercent: data.yearlyDiscountPercent,
        companyTypeId: data.companyTypeId,
        isPopular: data.isPopular,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
      include: {
        planServices: { include: { service: true } },
        companyType: true,
      },
    });

    return plan;
  }

  async updatePlanServices(id: number, serviceIds: number[]) {
    // Delete existing plan services
    await this.prisma.planService.deleteMany({ where: { planId: id } });

    // Create new plan services
    for (const serviceId of serviceIds) {
      await this.prisma.planService.create({
        data: {
          planId: id,
          serviceId,
        },
      });
    }

    return this.getPlanById(id);
  }

  async deletePlan(id: number) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }
}
