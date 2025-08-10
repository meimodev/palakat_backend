import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Membership, Prisma } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMembershipDto: Prisma.MembershipCreateInput,
  ): Promise<{ message: string; data: Membership }> {
    const membership = await this.prisma.membership.create({
      data: createMembershipDto,
      include: {
        account: true,
        church: true,
        column: true,
      },
    });

    return {
      message: 'Membership created successfully',
      data: membership,
    };
  }

  async findAll(
    churchId?: number,
    columnId?: number,
    page?: number,
    pageSize?: number,
  ): Promise<{
    message: string;
    data: Membership[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const where: Prisma.MembershipWhereInput = {};

    if (churchId) {
      where.churchId = churchId;
    }
    if (columnId) {
      where.columnId = columnId;
    }

    // Safe pagination defaults and bounds to avoid NaN/invalid values
    const currentPage = Math.max(1, page ?? 1);
    const take = Math.min(Math.max(1, pageSize ?? 20), 100);
    const skip = (currentPage - 1) * take;

    const [total, memberships] = await this.prisma.$transaction([
      this.prisma.membership.count({ where }),
      this.prisma.membership.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' },
        include: {
          account: true,
          church: true,
          column: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      message: 'Memberships retrieved successfully',
      data: memberships,
      pagination: {
        page: currentPage,
        pageSize: take,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  async findOne(id: number): Promise<{ message: string; data: Membership }> {
    const membership = await this.prisma.membership.findUniqueOrThrow({
      where: { id },
      include: {
        account: true,
        church: true,
        column: true,
      },
    });

    return {
      message: 'Membership retrieved successfully',
      data: membership,
    };
  }

  async update(
    id: number,
    updateMembershipDto: Prisma.MembershipUpdateInput,
  ): Promise<{ message: string; data: Membership }> {
    const membership = await this.prisma.membership.update({
      where: { id },
      data: updateMembershipDto,
      include: {
        account: true,
        church: true,
        column: true,
      },
    });

    return {
      message: 'Membership updated successfully',
      data: membership,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.prisma.membership.delete({
      where: { id },
    });

    return {
      message: 'Membership deleted successfully',
    };
  }
}
