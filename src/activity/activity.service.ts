import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ActivityListQueryDto } from './dto/activity-list.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ActivityListQueryDto) {
    const {
      membershipId,
      churchId,
      columnId,
      startTimestamp,
      endTimestamp,
      skip,
      take,
    } = query;

    const where: any = {
      supervisorId: membershipId,
      supervisor: {
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

    const [total, activities] = await (this.prisma as any).$transaction([
      (this.prisma as any).activity.count({ where }),
      (this.prisma as any).activity.findMany({
        where,
        take,
        skip,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          activityType: true,
          supervisorId: true,
          supervisor: true,
          location: true,
          _count: { select: { approvers: true } },
        },
      }),
    ]);

    return {
      message: 'Activities retrieved successfully',
      data: activities,
      total,
    };
  }

  async findOne(id: number) {
    const activity = await (this.prisma as any).activity.findUniqueOrThrow({
      where: { id },
      include: {
        supervisor: true,
        location: true,
      },
    });
    return {
      message: 'Activity retrieved successfully',
      data: activity,
    };
  }

  async remove(id: number) {
    await (this.prisma as any).activity.delete({
      where: { id },
    });
    return {
      message: 'Activity deleted successfully',
    };
  }

  async create(
    createActivityDto: any,
  ): Promise<{ message: string; data: any }> {
    const activity = await (this.prisma as any).activity.create({
      data: createActivityDto,
      include: {
        supervisor: true,
        location: true,
      },
    });
    return {
      message: 'Activity created successfully',
      data: activity,
    };
  }

  async update(
    id: number,
    updateActivityDto: any,
  ): Promise<{ message: string; data: any }> {
    const activity = await (this.prisma as any).activity.update({
      where: { id },
      data: updateActivityDto,
    });
    return {
      message: 'Activity updated successfully',
      data: activity,
    };
  }
}
