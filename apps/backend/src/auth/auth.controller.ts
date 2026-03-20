import { Controller, Post, Body, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { JwtAuthGuard } from './jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') 
  async register(@Body() dto: RegisterDto) { 
    const result = await this.auth.register(dto);
    console.log('📤 Register response:', { hasUser: !!result.user, hasToken: !!result.token, tokenLength: result.token?.length });
    return result;
  }
  @Post('login')    login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Post('google/signup')
  googleSignup(@Body() dto: GoogleAuthDto) {
    return this.auth.googleAuth(dto, 'signup');
  }

  @Post('google/login')
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.auth.googleAuth(dto, 'login');
  }

  @Post('magic-link/send')
  sendMagicLink(@Body() body: { email: string, type: 'login' | 'signup' }) {
    return this.auth.sendMagicLink(body.email, body.type);
  }

  @Get('magic-link/verify')
  verifyMagicLink(@Query('token') token: string) {
    return this.auth.verifyMagicLink(token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string, newPassword: string }) {
    return this.auth.resetPassword(body.token, body.newPassword);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) { 
    console.log('👤 /auth/me called, user:', req.user);
    return req.user; 
  }
}
