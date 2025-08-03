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
  ): Promise<{ message: string; data: Membership[] }> {
    const where: Prisma.MembershipWhereInput = {};

    if (churchId) {
      where.churchId = churchId;
    }
    if (columnId) {
      where.columnId = columnId;
    }

    const memberships = await this.prisma.membership.findMany({
      where,
      include: {
        account: true,
        church: true,
        column: true,
      },
    });

    return {
      message: 'Memberships retrieved successfully',
      data: memberships,
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
