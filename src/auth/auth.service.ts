import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateClientToken(payload: { clientId: string }) {
    const token = this.jwtService.sign(payload);
    if (!token) {
      throw new Error('Token generation failed');
    }

    return {
      data: token,
      message: 'Client authenticated successfully',
    };
  }

  async validate(phone: string) {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: { phone },
      include: {
        membership: true,
      },
    });
    return {
      message: 'OK',
      data: account,
    };
  }
}
