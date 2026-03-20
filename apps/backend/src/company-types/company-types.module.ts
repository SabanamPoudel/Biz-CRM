import { Module } from '@nestjs/common';
import { CompanyTypesController } from './company-types.controller';
import { CompanyTypesService } from './company-types.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CompanyTypesController],
  providers: [CompanyTypesService, PrismaService],
  exports: [CompanyTypesService],
})
export class CompanyTypesModule {}
