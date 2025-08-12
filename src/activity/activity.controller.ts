import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Param,
  Delete,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../common/pagination/pagination.decorator';
import { PaginationParams } from '../../common/pagination/pagination.types';

@UseGuards(AuthGuard('jwt'))
@Controller('activity')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async findAll(
    @Query('membershipId') membershipId?: string,
    @Query('churchId') churchId?: string,
    @Query('columnId') columnId?: string,
    @Query('startTimestamp') startTimestamp?: string,
    @Query('endTimestamp') endTimestamp?: string,
    @Pagination() pagination?: PaginationParams,
  ) {
    const membership_id = membershipId ? parseInt(membershipId, 10) : undefined;
    const church_id = churchId ? parseInt(churchId, 10) : undefined;
    const column_id = columnId ? parseInt(columnId, 10) : undefined;
    const startDate = startTimestamp ? new Date(startTimestamp) : undefined;
    const endDate = endTimestamp ? new Date(endTimestamp) : undefined;

    return this.activitiesService.findAll({
      membershipId: membership_id,
      churchId: church_id,
      columnId: column_id,
      startTimestamp: startDate,
      endTimestamp: endDate,
      skip: pagination?.skip ?? 0,
      take: pagination?.take ?? 20,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.remove(id);
  }

  @Post()
  async create(@Body() createActivityDto: Prisma.ActivityCreateInput) {
    return this.activitiesService.create(createActivityDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: Prisma.ActivityUpdateInput,
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }
}
