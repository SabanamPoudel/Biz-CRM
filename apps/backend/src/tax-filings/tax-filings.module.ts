import { Module } from '@nestjs/common';
import { TaxFilingsController } from './tax-filings.controller';
import { TaxFilingsService } from './tax-filings.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TaxFilingsController],
  providers: [TaxFilingsService, PrismaService],
})
export class TaxFilingsModule {}
