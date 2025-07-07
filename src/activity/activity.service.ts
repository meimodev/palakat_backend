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
    return this.prisma.activity.findMany({
        where: {
            membershipId: membership_id,
            membership:{
                churchId: church_id,
                columnId: column_id
            }
        }
    })
  }
}
