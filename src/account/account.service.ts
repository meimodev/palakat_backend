import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { internalServerError, notFound, badRequest } from 'src/common/errors';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) { }

  async findOne(params: { phone?: string; id?: string }) {
    const { phone, id } = params;

    if (!phone && !id) {
      badRequest('Either phone or id must be provided.');
    }

    try {
      const account = await this.prisma.account.findFirst({
        where: {
          ...(phone ? { phone } : {}),
          ...(id && { id: parseInt(id) }),
        },
        include: {
          membership: {
            include: {
              column: true,
              church: true,
            },
          },
        },
      });

      if (!account) {
        notFound('Account not found');
      }

      return {
        message: HttpStatus.OK,
        data: account,
      };
    } catch (error) {
      console.error('Error finding account:', error);
      internalServerError('Error retrieving account');
    }
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
}
