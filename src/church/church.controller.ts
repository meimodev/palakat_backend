import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChurchService } from './church.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from '../../common/pagination/pagination.decorator';
import { PaginationParams } from '../../common/pagination/pagination.types';

@UseGuards(AuthGuard('jwt'))
@Controller('church')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Get()
  async getChurches(
    @Query('search') search?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Pagination() pagination?: PaginationParams,
  ) {
    return this.churchService.getChurches({
      search,
      latitude,
      longitude,
      skip: pagination?.skip ?? 0,
      take: pagination?.take ?? 20,
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
