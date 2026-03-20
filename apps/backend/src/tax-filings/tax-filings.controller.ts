import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TaxFilingsService } from './tax-filings.service';

@Controller('tax-filings')
export class TaxFilingsController {
  constructor(private readonly taxFilingsService: TaxFilingsService) {}

  @Post()
  create(@Body() createTaxFilingDto: any) {
    const { companyId, ...data } = createTaxFilingDto;
    return this.taxFilingsService.create(companyId, data);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.taxFilingsService.findAll(Number(companyId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxFilingsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaxFilingDto: any) {
    return this.taxFilingsService.update(Number(id), updateTaxFilingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxFilingsService.remove(Number(id));
  }
}
