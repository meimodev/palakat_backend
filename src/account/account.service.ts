import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccount(params: Prisma.AccountWhereUniqueInput) {
    const { phone, id } = params;

    let whereClause: Prisma.AccountWhereUniqueInput;

    if (phone) {
      whereClause = { phone: phone };
    } else {
      whereClause = { id: Number(id) };
    }

    const account = await this.prisma.account.findUniqueOrThrow({
      where: whereClause,
      include: {
        membership: true,
      },
    });

    return {
      message: 'OK',
      data: account,
    };
  }

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

  async update(id: number, updateAccountDto: Prisma.AccountUpdateInput) {
    const account = await this.prisma.account.update({
      where: { id: id },
      data: updateAccountDto,
    });
    if (account) {
      return {
        message: 'OK',
        data: account,
      };
    }
  }

  async delete(id: number) {
    const account = await this.prisma.account.delete({
      where: { id: id },
    });
    if (account) {
      return {
        message: 'OK',
      };
    }
  }
}
