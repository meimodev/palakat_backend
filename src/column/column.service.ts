import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ColumnService {
  constructor(private readonly prismaService: PrismaService) {}

  async getColumns(church_id?: number) {
    const columns = await this.prismaService.column.findMany({
      where: {
        churchId: church_id,
      },
    });
    return {
      message: 'Columns fetched successfully',
      data: columns,
    };
  }
}
