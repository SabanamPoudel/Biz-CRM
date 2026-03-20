import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body() body: {
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
    return this.plansService.createPlan(body);
  }

  @Get()
  findAll() {
    return this.plansService.getAllPlans();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.getPlanById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.plansService.updatePlan(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.deletePlan(+id);
  }

  @Put(':id/services')
  updateServices(@Param('id') id: string, @Body() body: { serviceIds: number[] }) {
    return this.plansService.updatePlanServices(+id, body.serviceIds);
  }
}
