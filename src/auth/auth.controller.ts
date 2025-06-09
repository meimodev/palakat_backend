import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';   
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ValidatedClient } from './strategies/client.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signing')
  @UseGuards(AuthGuard('client-signing'))
  async signingClient(@Req() req: Request) {
    return this.authService.generateClientToken(req.user as ValidatedClient);
  }

  @Post('validate-user')
  async validateUser(phone: string) {
    return this.authService.validateUser(phone);
  }
}
