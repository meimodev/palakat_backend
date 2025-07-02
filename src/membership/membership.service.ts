import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership, Prisma } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async create(
    createMembershipDto: CreateMembershipDto,
  ): Promise<{ message: string; data: Membership }> {
    const { account_id, church_id, column_id, ...rest } = createMembershipDto;

    await this.validateRelatedEntities(account_id, church_id, column_id);

    const membership = await this.prisma.membership.create({
      data: {
        ...rest,
        accountId: account_id,
        churchId: church_id,
        columnId: column_id,
      },
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
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<{ message: string; data: Membership }> {
    await this.findOne(id); // cek jika membership ada

    const { church_id, column_id, ...rest } = updateMembershipDto;

    const membership = await this.prisma.membership.update({
      where: { id },
      data: {
        ...rest,
        ...(church_id !== undefined && { churchId: church_id }),
        ...(column_id !== undefined && { columnId: column_id }),
      },
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

  // Helper method
  private async validateRelatedEntities(
    accountId: number,
    churchId: number,
    columnId: number,
  ) {
    const [account, church, column] = await Promise.all([
      this.prisma.account.findUnique({ where: { id: accountId } }),
      this.prisma.church.findUnique({ where: { id: churchId } }),
      this.prisma.column.findUnique({ where: { id: columnId } }),
    ]);

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    if (!church) {
      throw new NotFoundException(`Church with ID ${churchId} not found`);
    }
    if (!column) {
      throw new NotFoundException(`Column with ID ${columnId} not found`);
    }
  }
}
