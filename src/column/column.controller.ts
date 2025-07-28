import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ColumnService } from './column.service';
import { Prisma } from '@prisma/client';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  async getColumns(@Query('church_id') church_id?: string) {
    const ChurchId = church_id ? parseInt(church_id, 10) : undefined;
    return this.columnService.getColumns(ChurchId);
  }

  @Get(':id')
  async getColumn(@Param('id', ParseIntPipe) id: number) {
    return this.columnService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.columnService.remove(id);
  }

  @Post()
  async create(@Body() createColumn: Prisma.ColumnCreateInput) {
    return this.columnService.create(createColumn);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, @Body() updateColumn: Prisma.ColumnUpdateInput){
    return this.columnService.update(id, updateColumn);
  }
}

