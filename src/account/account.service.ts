import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { AccountListQueryDto } from './dto/account-list.dto';
import { AccountCountQueryDto } from './dto/account-count.dto';
@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: AccountListQueryDto) {
    const { churchId, skip, take, search, position } = params;

    const where: Prisma.AccountWhereInput = {};
    const membershipWhere: any = {};
    if (typeof churchId === 'number') {
      membershipWhere.churchId = churchId;
    }
    if (typeof position === 'string' && position.trim().length > 0) {
      membershipWhere.membershipPositions = {
        some: { name: { contains: position.trim(), mode: 'insensitive' } },
      };
    }
    if (Object.keys(membershipWhere).length > 0) {
      (where as any).membership = membershipWhere;
    }

    const baseSelect = {
      id: true,
      name: true,
      phone: true,
      email: true,
      isActive: true,
      claimed: true,
      failedLoginAttempts: true,
      lockUntil: true,
      gender: true,
      married: true,
      dob: true,
      createdAt: true,
      updatedAt: true,
      membership: {
        select: {
          id: true,
          churchId: true,
          columnId: true,
          baptize: true,
          sidi: true,
          createdAt: true,
          updatedAt: true,
          column: {
            select: {
              id: true,
              name: true,
              churchId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          membershipPositions: {
            select: {
              id: true,
              name: true,
              churchId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    } as const;

    // Tiered search: account.name -> membership.column.name -> membership.membershipPositions.name
    const normalizedSearch =
      typeof search === 'string' && search.trim().length > 0
        ? search.trim()
        : null;

    let activeWhere: Prisma.AccountWhereInput = { ...where };
    if (normalizedSearch) {
      activeWhere = {
        ...where,
        name: { contains: normalizedSearch, mode: 'insensitive' },
      };
    }

    let searchSource: string | null = null;

    let [total, accounts] = await (this.prisma as any).$transaction([
      (this.prisma as any).account.count({ where: activeWhere }),
      (this.prisma as any).account.findMany({
        where: activeWhere,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        select: baseSelect,
      }),
    ]);

    if (normalizedSearch) {
      searchSource = 'account.name';
    }

    if (normalizedSearch && total === 0) {
      // Fallback 2: search by column.name
      activeWhere = {
        ...where,
        membership: {
          ...(where.membership as any),
          column: { name: { contains: normalizedSearch, mode: 'insensitive' } },
        } as any,
      };

      [total, accounts] = await (this.prisma as any).$transaction([
        (this.prisma as any).account.count({ where: activeWhere }),
        (this.prisma as any).account.findMany({
          where: activeWhere,
          take,
          skip,
          orderBy: { createdAt: 'asc' },
          select: baseSelect,
        }),
      ]);

      if (normalizedSearch) {
        searchSource = 'column.name';
      }
    }

    if (normalizedSearch && total === 0) {
      // Fallback 3: search by membershipPositions.name
      activeWhere = {
        ...where,
        membership: {
          ...(where.membership as any),
          membershipPositions: {
            some: { name: { contains: normalizedSearch, mode: 'insensitive' } },
          },
        } as any,
      };

      [total, accounts] = await (this.prisma as any).$transaction([
        (this.prisma as any).account.count({ where: activeWhere }),
        (this.prisma as any).account.findMany({
          where: activeWhere,
          take,
          skip,
          orderBy: { createdAt: 'asc' },
          select: baseSelect,
        }),
      ]);

      if (normalizedSearch) {
        searchSource = 'membershipPosition.name';
      }
    }

    return {
      message: normalizedSearch ? `OK - ${searchSource}` : 'OK',
      data: accounts,
      total,
    };
  }

  async count(params: AccountCountQueryDto) {
    const { churchId } = params;
    const baseMembershipWhere: any = {};
    if (typeof churchId === 'number') {
      baseMembershipWhere.churchId = churchId;
    }

    const totalWhere: Prisma.AccountWhereInput = {};
    if (Object.keys(baseMembershipWhere).length > 0) {
      (totalWhere as any).membership = baseMembershipWhere as any;
    }

    const claimedWhere: Prisma.AccountWhereInput = {
      ...totalWhere,
      claimed: true,
    };

    const baptizedWhere: Prisma.AccountWhereInput = {
      ...totalWhere,
      membership: (Object.keys(baseMembershipWhere).length > 0
        ? { ...baseMembershipWhere, baptize: true }
        : { baptize: true }) as any,
    };

    const sidiWhere: Prisma.AccountWhereInput = {
      ...totalWhere,
      membership: (Object.keys(baseMembershipWhere).length > 0
        ? { ...baseMembershipWhere, sidi: true }
        : { sidi: true }) as any,
    };

    const [total, claimed, baptized, sidi] = await this.prisma.$transaction([
      this.prisma.account.count({ where: totalWhere }),
      this.prisma.account.count({ where: claimedWhere }),
      this.prisma.account.count({ where: baptizedWhere }),
      this.prisma.account.count({ where: sidiWhere }),
    ]);

    return {
      message: 'OK',
      data: {
        total,
        claimed,
        baptized,
        sidi,
      },
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
