import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(data: {
    name: string;
    slug: string;
    description?: string;
    type?: 'BASE' | 'ADDON';
    billingInterval?: 'ONE_TIME' | 'MONTHLY' | 'YEARLY';
    isActive?: boolean;
    sortOrder?: number;
    features?: Array<{ name: string; description?: string }>;
    categories?: number[];
    pricing?: Array<{ companyTypeId: number; priceCents: number }>;
  }) {
    const service = await this.prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type || 'BASE',
        billingInterval: data.billingInterval || 'ONE_TIME',
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: {
        features: true,
        categories: { include: { category: true } },
        pricing: true,
      },
    });

    // Add features if provided
    if (data.features && data.features.length > 0) {
      for (const feature of data.features) {
        await this.prisma.serviceFeature.create({
          data: {
            serviceId: service.id,
            name: feature.name,
            description: feature.description,
          },
        });
      }
    }

    // Add categories if provided
    if (data.categories && data.categories.length > 0) {
      for (const categoryId of data.categories) {
        await this.prisma.serviceCategory.create({
          data: {
            serviceId: service.id,
            categoryId,
          },
        });
      }
    }

    // Add pricing if provided
    if (data.pricing && data.pricing.length > 0) {
      for (const price of data.pricing) {
        await this.prisma.serviceCompanyPricing.create({
          data: {
            serviceId: service.id,
            companyTypeId: price.companyTypeId,
            priceCents: price.priceCents,
          },
        });
      }
    }

    return this.getServiceById(service.id);
  }

  async getAllServices() {
    return this.prisma.service.findMany({
      include: {
        features: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        pricing: true,
        planServices: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getServiceById(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        features: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        pricing: true,
        planServices: true,
      },
    });
  }

  async updateService(id: number, data: any) {
    const service = await this.prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        billingInterval: data.billingInterval,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
      include: {
        features: true,
        categories: { include: { category: true } },
        pricing: true,
      },
    });

    // Update features if provided
    if (data.features) {
      // Delete existing features
      await this.prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
      
      // Create new features
      for (const feature of data.features) {
        await this.prisma.serviceFeature.create({
          data: {
            serviceId: id,
            name: feature.name,
            description: feature.description,
          },
        });
      }
    }

    // Update categories if provided
    if (data.categories) {
      await this.prisma.serviceCategory.deleteMany({ where: { serviceId: id } });
      for (const categoryId of data.categories) {
        await this.prisma.serviceCategory.create({
          data: {
            serviceId: id,
            categoryId,
          },
        });
      }
    }

    return this.getServiceById(id);
  }

  async updateServicePricing(id: number, pricing: Array<{ companyTypeId: number; priceCents: number }>) {
    // Delete existing pricing
    await this.prisma.serviceCompanyPricing.deleteMany({ where: { serviceId: id } });

    // Create new pricing
    for (const price of pricing) {
      await this.prisma.serviceCompanyPricing.create({
        data: {
          serviceId: id,
          companyTypeId: price.companyTypeId,
          priceCents: price.priceCents,
        },
      });
    }

    return this.getServiceById(id);
  }

  async deleteService(id: number) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
