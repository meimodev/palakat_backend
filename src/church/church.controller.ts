import { Controller, Get, Query } from '@nestjs/common';
import { ChurchService } from './church.service';

@Controller('church')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Get()
  async getChurches(
    @Query('search') search?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ){
    return this.churchService.getChurches({
      search,
      latitude,
      longitude,
    });
  }
}
