import { Injectable } from '@nestjs/common';
import { Activity, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    membership_id?: number,
    church_id?: number,
    column_id?: number,
    startTimestamp?: Date,
    endTimestamp?: Date,
) {
  const where: Prisma.ActivityWhereInput = {
    membershipId: membership_id,
    membership: {
      churchId: church_id,
      columnId: column_id,
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

  const activity = await this.prisma.activity.findMany({
    where,
  });
  return {
    message: 'Activities retrieved successfully',
    data: activity,
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
