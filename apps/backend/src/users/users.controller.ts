import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { name: string; email: string; passwordHash: string }) {
    return this.usersService.createUser(body.name, body.email, body.passwordHash);
  }

  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; email?: string }) {
    return this.usersService.updateUser(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('onboarding')
  updateOnboarding(@Request() req, @Body() body: {
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
    console.log('📝 Onboarding update - req.user:', req.user);
    const userId = req.user.id || req.user.userId;
    console.log('📝 Using userId:', userId);
    return this.usersService.updateOnboarding(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/data')
  getOnboardingData(@Request() req) {
    const userId = req.user.id || req.user.userId;
    return this.usersService.getOnboardingData(userId);
  }
}
