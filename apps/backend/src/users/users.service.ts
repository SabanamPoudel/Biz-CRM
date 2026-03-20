import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, email: string, passwordHash: string) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new ConflictException(
          `A user with email '${email}' already exists`
        );
      }

      return await this.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Re-throw our custom error
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is the error code for unique constraint violation
        if (error.code === 'P2002') {
          throw new ConflictException(
            `A user with email '${email}' already exists`
          );
        }
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateOnboarding(userId: number, data: {
    country?: string;
    companyOrigin?: string;
    businessType?: string;
    companyName?: string;
    selectedState?: string;
    ownershipData?: string;
    selectedPlan?: string;
    billingType?: string;
    expeditedEIN?: boolean;
    upgradeToCompliance?: boolean;
    onboardingComplete?: boolean;
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        country: data.country,
        companyOrigin: data.companyOrigin,
        businessType: data.businessType,
        companyName: data.companyName,
        selectedState: data.selectedState,
        ownershipData: data.ownershipData,
        selectedPlan: data.selectedPlan,
        billingType: data.billingType,
        expeditedEIN: data.expeditedEIN,
        upgradeToCompliance: data.upgradeToCompliance,
        onboardingComplete: data.onboardingComplete,
      },
    });
  }

  async getOnboardingData(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        country: true,
        companyOrigin: true,
        businessType: true,
        companyName: true,
        selectedState: true,
        selectedPlan: true,
        billingType: true,
        expeditedEIN: true,
        upgradeToCompliance: true,
        onboardingComplete: true,
      },
    });
    return user;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
