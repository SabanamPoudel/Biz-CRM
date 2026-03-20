import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, PrismaService],
  exports: [PlansService],
})
export class PlansModule {}
