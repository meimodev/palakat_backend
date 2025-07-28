import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ColumnService } from './column.service';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Get()
  async getColumns(@Query('church_id', ParseIntPipe) church_id?: number) {
    return this.columnService.getColumns(church_id);
  }
}
