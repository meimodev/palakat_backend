import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    membership_id?: number,
    church_id?: number,
    column_id?: number,
  ){
    const activity = await this.prisma.activity.findMany({
      where: {
        membershipId: membership_id,
        membership:{
          churchId: church_id,
          columnId: column_id
        }
      }
    })
    return {
      message: 'Activities retrieved successfully',
      data: activity
    }
  }

  async findOne(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id }
    })
    return {
      message: 'Activity retrieved successfully',
      data: activity
    }
  }
}
