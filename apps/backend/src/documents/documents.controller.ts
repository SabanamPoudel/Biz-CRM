import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: any) {
    const { companyId, ...data } = createDocumentDto;
    return this.documentsService.create(companyId, data);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.documentsService.findAll(Number(companyId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: any) {
    return this.documentsService.update(Number(id), updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(Number(id));
  }
}
