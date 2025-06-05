import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate-user')
  async validateUser(phone: string) {
    return this.authService.validateUser(phone);
  }
}
