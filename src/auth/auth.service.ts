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

  async validateUser(phone: string) {
    try {
      const account = await this.prisma.account.findUnique({
        where: { phone },
      });
      if (account) {
        return {
          statusCode: 200,
          message: 'User found',
          data: account,
        };
      } else {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: `User validation failed`,
        data: null,
      };
    }
  }
}
