import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '../../prisma/generated/prisma';
import { MembershipPositionListQueryDto } from './dto/membership-position-list.dto';

@Injectable()
export class MembershipPositionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Prisma.MembershipPositionCreateInput) {
    const record = await this.prisma.membershipPosition.create({
      data: dto,
    });

    return {
      message: 'OK',
      data: record,
    } as const;
  }

  async findAll(query: MembershipPositionListQueryDto) {
    const { churchId, columnId, membershipId, skip, take } =
      query ?? ({} as any);

    const where: Prisma.MembershipPositionWhereInput = {};
    if (churchId) where.churchId = churchId;
    if (columnId) where.columnId = columnId;
    if (membershipId) where.membershipId = membershipId;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.membershipPosition.count({ where }),
      this.prisma.membershipPosition.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      message: 'OK',
      data: items,
      total,
    } as const;
  }

  async findOne(id: number) {
    const item = await this.prisma.membershipPosition.findUniqueOrThrow({
      where: { id },
    });
    return { message: 'OK', data: item } as const;
  }

  async update(id: number, dto: Prisma.MembershipPositionUpdateInput) {
    const item = await this.prisma.membershipPosition.update({
      where: { id },
      data: dto,
    });
    return { message: 'OK', data: item } as const;
  }

  async delete(id: number) {
    await this.prisma.membershipPosition.delete({ where: { id } });
    return { message: 'OK' } as const;
  }
}
