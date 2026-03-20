import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, GoogleAuthDto } from './dto';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  private magicLinkTokens = new Map<string, { email: string, type: 'login' | 'signup', expiresAt: Date }>();
  private resetPasswordTokens = new Map<string, { email: string, expiresAt: Date }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, passwordHash: passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return { user, token: await this.sign(user) };
  }

  async login(dto: LoginDto) {
    console.log('🔐 Login attempt for:', dto.email);
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      console.log('❌ User not found:', dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      console.log('❌ Invalid password for:', dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = await this.sign(payload);
    console.log('✅ Login successful for:', dto.email);
    console.log('📝 Token generated, length:', token.length);
    return { user: payload, token: token };
  }

  async sendMagicLink(email: string, type: 'login' | 'signup') {
    // For signup, check if user doesn't exist
    if (type === 'signup') {
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already registered. Please use login instead.');
      }
    }
    
    // For login, check if user exists
    if (type === 'login') {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('No account found with this email. Please sign up first.');
      }
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token (in production, use Redis or database)
    this.magicLinkTokens.set(token, { email, type, expiresAt });

    // Create magic link - points to frontend which will verify with backend
    const magicLink = `http://localhost:3000/auth/magic-link?token=${token}`;

    // Send email
    try {
      await this.emailService.sendMagicLinkEmail(email, magicLink, type);
      console.log(`✅ Magic link sent to ${email} (${type})`);
    } catch (error) {
      // If email fails, still log the link for development
      console.log(`⚠️ Email sending failed, but here's the magic link for testing:`);
      console.log(`Magic Link for ${email} (${type}): ${magicLink}`);
    }
    
    return { 
      message: 'Magic link sent successfully. Please check your email.',
      // In development, still return the link for testing if email fails
      magicLink: process.env.NODE_ENV === 'development' ? magicLink : undefined
    };
  }

  async verifyMagicLink(token: string) {
    const tokenData = this.magicLinkTokens.get(token);
    
    if (!tokenData) {
      throw new BadRequestException('Invalid or expired magic link');
    }

    if (new Date() > tokenData.expiresAt) {
      this.magicLinkTokens.delete(token);
      throw new BadRequestException('Magic link has expired');
    }

    // Remove token after use
    this.magicLinkTokens.delete(token);

    const { email, type } = tokenData;

    if (type === 'signup') {
      // Create new user
      const user = await this.prisma.user.create({
        data: {
          email,
          name: email.split('@')[0], // Use email prefix as default name
          passwordHash: '', // No password for magic link users
        },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      return { 
        user, 
        accessToken: await this.sign(user),
        type: 'signup'
      };
    } else {
      // Login existing user
      const user = await this.prisma.user.findUnique({ 
        where: { email },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { 
        user, 
        accessToken: await this.sign(user),
        type: 'login'
      };
    }
  }

  async googleAuth(dto: GoogleAuthDto, type: 'signup' | 'login') {
    if (type === 'signup') {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({ 
        where: { email: dto.email }
      });
      
      if (existingUser) {
        throw new ConflictException('Email already registered. Please use login instead.');
      }
      
      // Create new user for Google signup
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash: '', // Empty password for Google auth users
          googleId: dto.googleId,
          picture: dto.picture,
        },
      });

      const payload = { id: newUser.id, email: newUser.email, name: newUser.name };
      return { user: payload, access_token: await this.sign(payload) };
    } else {
      // Login flow
      const user = await this.prisma.user.findUnique({ 
        where: { email: dto.email }
      });
      
      if (!user) {
        throw new UnauthorizedException('No account found with this email. Please sign up first.');
      }
      
      // Update Google ID and picture if not set
      const updatedUser = await this.prisma.user.update({
        where: { email: dto.email },
        data: { googleId: dto.googleId, picture: dto.picture },
      });

      const payload = { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name };
      return { user: payload, access_token: await this.sign(payload) };
    }
  }

  async forgotPassword(email: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('No account found with this email.');
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    this.resetPasswordTokens.set(token, { email, expiresAt });

    // Create reset link - points to frontend reset password page
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Send email
    try {
      await this.emailService.sendPasswordResetEmail(email, resetLink);
      console.log(`✅ Password reset link sent to ${email}`);
    } catch (error) {
      console.log(`⚠️ Email sending failed, but here's the reset link for testing:`);
      console.log(`Reset Link for ${email}: ${resetLink}`);
    }

    return {
      message: 'Password reset link sent successfully. Please check your email.',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenData = this.resetPasswordTokens.get(token);

    if (!tokenData) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetPasswordTokens.delete(token);
      throw new BadRequestException('Reset token has expired');
    }

    // Remove token after use
    this.resetPasswordTokens.delete(token);

    const { email } = tokenData;

    // Update user password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return { message: 'Password has been reset successfully' };
  }

  private async sign(payload: any) {
    return this.jwt.signAsync(payload);
  }
}
