import { Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ColumnService } from './column.service';

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
}

