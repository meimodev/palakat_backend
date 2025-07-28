import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ColumnService {
  constructor(private readonly prismaService: PrismaService) {}

  async getColumns(churchId?: number) {
    const columns = await this.prismaService.column.findMany({
      where: {
        churchId: churchId,
      },
    });
    return {
      message: 'Columns fetched successfully',
      data: columns,
    };
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

  async remove(id:number): Promise<{ message: string }> {
    await this.prismaService.column.delete({
      where: { id },
    });
    return {
      message: 'Column deleted successfully',
    };
  }

  async create(createColumn: Prisma.ColumnCreateInput ){
    const column = await this.prismaService.column.create({
        data: createColumn,
        include : {
            church: true,
        }
    })
    return {
        message: 'Column created successfully',
        data: column,
    };
  }

  async update(id : number,updateColumn: Prisma.ColumnUpdateInput){
    const column = await this.prismaService.column.update({
        where:{id},
        data : updateColumn,
        include: {church : true}
    })
    return {
        message : 'column updated successfully',
        data : column
    }
  }
}
