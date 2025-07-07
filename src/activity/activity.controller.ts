import { Controller, Get, ParseIntPipe, Query, UseGuards, Param, Delete } from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('activity')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async findAll(
    @Query('membership_id') membershipId?: string,
    @Query('church_id') churchId?: string,
    @Query('column_id') columnId?: string,
  ){
    const membership_id = membershipId ? parseInt(membershipId, 10) : undefined;
    const church_id = churchId ? parseInt(churchId, 10) : undefined;
    const column_id = columnId ? parseInt(columnId, 10) : undefined;

    return this.activitiesService.findAll(
      membership_id,
      church_id,
      column_id,
    )
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number){
    return this.activitiesService.remove(id);
  }
}
