import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: any) {
    const { companyId, ...data } = createNoteDto;
    return this.notesService.create(companyId, data);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.notesService.findAll(Number(companyId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: any) {
    return this.notesService.update(Number(id), updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(Number(id));
  }
}
