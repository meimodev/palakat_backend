import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) { }

  async getAccount(params: Prisma.AccountWhereUniqueInput) {
    const { phone, id } = params;

    if (!phone && !id) {
      throw new BadRequestException('Either phone or id must be provided.');
    }

    let whereClause: Prisma.AccountWhereUniqueInput;

    if (phone) {
      whereClause = { phone: phone };
    } else {
      whereClause = { id: Number(id) };
    }

    try {
      const account = await this.prisma.account.findUnique({
        where: whereClause,
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
        throw new NotFoundException('Account not found');
      }

      return {
        message: HttpStatus.OK,
        data: account,
      };
    } catch (error) {
      console.error('Error finding account:', error);
      throw new InternalServerErrorException('Error retrieving account');
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
