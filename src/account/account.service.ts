import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountDto: Prisma.AccountCreateInput) {
    const account = await this.prisma.account.create({
      data: createAccountDto,
    });
    if (account) {
      return {
        message: 'OK',
        data: account,
      };
    }
  }
}
