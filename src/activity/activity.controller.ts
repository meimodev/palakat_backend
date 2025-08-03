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

@UseGuards(AuthGuard('jwt'))
@Controller('activity')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async findAll(
    @Query('membership_id') membershipId?: string,
    @Query('church_id') churchId?: string,
    @Query('column_id') columnId?: string,
    @Query('startTimestamp') startTimestamp?: string,
    @Query('endTimestamp') endTimestamp?: string,
  ) {
    const membership_id = membershipId ? parseInt(membershipId, 10) : undefined;
    const church_id = churchId ? parseInt(churchId, 10) : undefined;
    const column_id = columnId ? parseInt(columnId, 10) : undefined;
    const startDate = startTimestamp ? new Date(startTimestamp) : undefined;
    const endDate = endTimestamp ? new Date(endTimestamp) : undefined;

    return this.activitiesService.findAll(membership_id, church_id, column_id, startDate, endDate);
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
