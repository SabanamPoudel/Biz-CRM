import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CompanyTypesService } from './company-types.service';

@Controller('company-types')
export class CompanyTypesController {
  constructor(private readonly companyTypesService: CompanyTypesService) {}

  @Post()
  create(@Body() body: {
    name: string;
    slug: string;
    description?: string;
    advantages?: string[];
    disadvantages?: string[];
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return this.companyTypesService.createCompanyType(body);
  }

  @Get()
  findAll() {
    return this.companyTypesService.getAllCompanyTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyTypesService.getCompanyTypeById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.companyTypesService.updateCompanyType(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyTypesService.deleteCompanyType(+id);
  }
}
