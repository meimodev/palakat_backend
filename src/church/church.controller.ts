import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChurchService } from './church.service';
import { Prisma } from '@prisma/client';

@Controller('church')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Get()
  async getChurches(
    @Query('search') search?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize?: number,
  ) {
    return this.churchService.getChurches({
      search,
      latitude,
      longitude,
      page,
      pageSize,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.churchService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.churchService.remove(id);
  }

  @Post()
  async create(@Body() createchurchDto: Prisma.ChurchCreateInput) {
    return this.churchService.create(createchurchDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChurchDto: Prisma.ChurchUpdateInput,
  ) {
    return this.churchService.update(id, updateChurchDto);
  }
}
