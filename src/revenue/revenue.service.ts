import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RevenueListQueryDto } from './dto/revenue-list.dto';

@Injectable()
export class RevenueService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: RevenueListQueryDto) {
    const { churchId, search, skip, take } = query;

    const where: any = {
      churchId: churchId,
    };

    if (search) {
      where.OR = [{ accountNumber: { contains: search, mode: 'insensitive' } }];
    }

    const [total, revenues] = await (this.prisma as any).$transaction([
      (this.prisma as any).revenue.count({ where }),
      (this.prisma as any).revenue.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' },
        include: {
          activity: {
            include: {
              approvers: true,
              supervisor: true,
            },
          },
        },
      }),
    ]);

    // Track which fields matched the search
    let searchInfo = '';
    if (search && revenues.length > 0) {
      const matchedFields = new Set<string>();
      revenues.forEach((revenue: any) => {
        if (
          revenue.accountNumber?.toLowerCase().includes(search.toLowerCase())
        ) {
          matchedFields.add('accountNumber');
        }
      });
      if (matchedFields.size > 0) {
        searchInfo = ` (matched in: ${Array.from(matchedFields).join(', ')})`;
      }
    }

    return {
      message: `Revenues retrieved successfully${searchInfo}`,
      data: revenues,
      total,
    };
  }

  async findOne(id: number) {
    const revenue = await (this.prisma as any).revenue.findUniqueOrThrow({
      where: { id },
      include: {
        activity: {
          include: {
            approvers: true,
            supervisor: {
              include: {
                account: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    dob: true,
                  },
                },
                membershipPositions: true,
              },
            },
            location: true,
          },
        },
      },
    });
    return {
      message: 'Revenue retrieved successfully',
      data: revenue,
    };
  }

  async remove(id: number) {
    await (this.prisma as any).revenue.delete({
      where: { id },
    });
    return {
      message: 'Revenue deleted successfully',
    };
  }

  async create(createRevenueDto: any): Promise<{ message: string; data: any }> {
    const revenue = await (this.prisma as any).revenue.create({
      data: createRevenueDto,
      include: {
        activity: true,
      },
    });
    return {
      message: 'Revenue created successfully',
      data: revenue,
    };
  }

  async update(
    id: number,
    updateRevenueDto: any,
  ): Promise<{ message: string; data: any }> {
    const revenue = await (this.prisma as any).revenue.update({
      where: { id },
      data: updateRevenueDto,
    });
    return {
      message: 'Revenue updated successfully',
      data: revenue,
    };
  }
}
