import { Injectable, NotFoundException } from '@nestjs/common';
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
    church_id?: number,
    column_id?: number,
  ): Promise<{ message: string; data: Membership[] }> {
    const where: Prisma.MembershipWhereInput = {};

    if (church_id) {
      where.churchId = church_id;
    }
    if (column_id) {
      where.columnId = column_id;
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
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: {
        account: true,
        church: true,
        column: true,
      },
    });

    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }

    return {
      message: 'Membership retrieved successfully',
      data: membership,
    };
  }

  async update(
    id: number,
    updateMembershipDto: Prisma.MembershipUpdateInput,
  ): Promise<{ message: string; data: Membership }> {
    await this.findOne(id); // cek jika membership ada

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
