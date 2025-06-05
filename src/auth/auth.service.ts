import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
        message: `User validation failed ${error}`,
        data: null,
      };
    }
  }
}
