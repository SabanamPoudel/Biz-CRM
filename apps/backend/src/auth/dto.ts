export class RegisterDto { email: string; name?: string; password: string; }
export class LoginDto { email: string; password: string; }
export class GoogleAuthDto { 
  email: string; 
  name: string; 
  picture?: string; 
  googleId: string; 
}
