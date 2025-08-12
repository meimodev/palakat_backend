import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ColumnService {
  constructor(private readonly prismaService: PrismaService) {}

  async getColumns(params: {churchId? : number; skip: number, take: number}) {
    const { churchId, skip, take } = params;

    const _skip = Math.max(0, skip);
    const _take = Math.max(1, take);

    const where: Prisma.ColumnWhereInput = {};
    if (churchId) where.churchId = churchId;

    const [total, columns] = await this.prismaService.$transaction([
      this.prismaService.column.count({ where }),
      this.prismaService.column.findMany({
        where,
        skip : _skip,
        take : _take,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      message : 'Columns fetched successfully',
      data: columns,
      total,
    }
  }

  async findOne(id: number) {
    const column = await this.prismaService.column.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: 'Column fetched successfully',
      data: column,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.prismaService.column.delete({
      where: { id },
    });
    return {
      message: 'Column deleted successfully',
    };
  }

  async create(createColumn: Prisma.ColumnCreateInput) {
    const column = await this.prismaService.column.create({
      data: createColumn,
      include: {
        church: true,
      },
    });
    return {
      message: 'Column created successfully',
      data: column,
    };
  }

  async update(id: number, updateColumn: Prisma.ColumnUpdateInput) {
    const column = await this.prismaService.column.update({
      where: { id },
      data: updateColumn,
      include: { church: true },
    });
    return {
      message: 'column updated successfully',
      data: column,
    };
  }
}
