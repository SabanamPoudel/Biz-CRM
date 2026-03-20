import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() body: {
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
    return this.servicesService.createService(body);
  }

  @Get()
  findAll() {
    return this.servicesService.getAllServices();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.getServiceById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.servicesService.updateService(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.deleteService(+id);
  }

  @Put(':id/pricing')
  updatePricing(@Param('id') id: string, @Body() body: { pricing: Array<{ companyTypeId: number; priceCents: number }> }) {
    return this.servicesService.updateServicePricing(+id, body.pricing);
  }
}
