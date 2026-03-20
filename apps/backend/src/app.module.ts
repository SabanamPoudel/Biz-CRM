import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { TasksModule } from './tasks/tasks.module';
import { DocumentsModule } from './documents/documents.module';
import { TaxFilingsModule } from './tax-filings/tax-filings.module';
import { NotesModule } from './notes/notes.module';
import { ServicesModule } from './services/services.module';
import { PlansModule } from './plans/plans.module';
import { CompanyTypesModule } from './company-types/company-types.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule, 
    AuthModule, 
    PaymentModule,
    TasksModule,
    DocumentsModule,
    TaxFilingsModule,
    NotesModule,
    ServicesModule,
    PlansModule,
    CompanyTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
