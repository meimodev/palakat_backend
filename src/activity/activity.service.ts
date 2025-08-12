import { Injectable } from '@nestjs/common';
import { Activity, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    membershipId?: number;
    churchId?: number;
    columnId?: number;
    startTimestamp?: Date;
    endTimestamp?: Date;
    skip: number;
    take: number;
  }) {
    const {
      membershipId,
      churchId,
      columnId,
      startTimestamp,
      endTimestamp,
      skip,
      take,
    } = params;
    const _take = Math.max(1, take);
    const _skip = Math.max(0, skip);

    const where: Prisma.ActivityWhereInput = {
      membershipId: membershipId,
      membership: {
        churchId: churchId,
        columnId: columnId,
      },
    };

    if (startTimestamp || endTimestamp) {
      where.date = {};
      if (startTimestamp) {
        where.date.gte = startTimestamp;
      }
      if (endTimestamp) {
        where.date.lte = endTimestamp;
      }
    }

    const [total, activities] = await this.prisma.$transaction([
      this.prisma.activity.count({ where }),
      this.prisma.activity.findMany({
        where,
        take: _take,
        skip: _skip,
        orderBy: { date: 'desc' },
      }),
    ]);

    return {
      message: 'Activities retrieved successfully',
      data: activities,
      total,
    };
  }

  async findOne(id: number) {
    const activity = await this.prisma.activity.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: 'Activity retrieved successfully',
      data: activity,
    };
  }

  async remove(id: number) {
    await this.prisma.activity.delete({
      where: { id },
    });
    return {
      message: 'Activity deleted successfully',
    };
  }

  async create(
    createActivityDto: Prisma.ActivityCreateInput,
  ): Promise<{ message: string; data: Activity }> {
    const activity = await this.prisma.activity.create({
      data: createActivityDto,
      include: {
        membership: {},
      },
    });
    return {
      message: 'Activity created successfully',
      data: activity,
    };
  }

  async update(
    id: number,
    updateActivityDto: Prisma.ActivityUpdateInput,
  ): Promise<{ message: string; data: Activity }> {
    const activity = await this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
    return {
      message: 'Activity updated successfully',
      data: activity,
    };
  }
}
