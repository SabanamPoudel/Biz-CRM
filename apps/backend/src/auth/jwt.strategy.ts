import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'dev_super_secret_change_me';
    console.log('🔑 JwtStrategy constructor - JWT_SECRET from ConfigService:', secret?.substring(0, 10) + '...');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }
  async validate(payload: any) { 
    console.log('✅ JWT validated successfully! Payload:', payload);
    return payload; 
  } // becomes req.user
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log('🔐 JwtAuthGuard.handleRequest - err:', err, 'user:', user, 'info:', info);
    if (err || !user) {
      console.log('❌ JWT validation failed!');
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
