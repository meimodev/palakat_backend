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
    page?: number;
    pageSize?: number;
  }) {
    const {
      membershipId,
      churchId,
      columnId,
      startTimestamp,
      endTimestamp,
      page,
      pageSize,
    } = params;

    const take = Math.min(pageSize, 100);
    const skip = (page - 1) * take;

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
        take,
        skip,
        orderBy: { date: 'desc' },
      }),
    ]);

    const totalpages = Math.ceil(total / take);

    return {
      message : 'Activities retrieved successfully',
      data : activities,
      pagination: {
        page: page,
        pageSize: take,
        total,
        totalpages,
        hasNext: page < totalpages,
        hasPrevious: page > 1,
      },
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
