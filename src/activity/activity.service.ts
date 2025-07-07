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
    const activity = await this.prisma.activity.findUniqueOrThrow({
      where: { id }
    })
    return {
      message: 'Activity retrieved successfully',
      data: activity
    }
  }

  async remove(id: number){
    await this.prisma.activity.delete({
      where: {id}
    })
    return {
      message : 'Activity deleted successfully',
    }
  }

  async create(createActivityDto: Prisma.ActivityCreateInput): Promise<{ message: string; data: Activity }> {
    const activity = await this.prisma.activity.create({
      data: createActivityDto,
      include: {
        membership:{
          include: {
            account: true,
            church: true,
            column: true
          }
        }
      }
    })
    return {
      message: 'Activity created successfully',
      data: activity
    }
  }
}
