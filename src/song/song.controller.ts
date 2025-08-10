import {
  Body,
  Post,
  Get,
  Query,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SongService } from './song.service';

@UseGuards(AuthGuard('jwt'))
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  async create(@Body() createSongDto: Prisma.SongCreateInput) {
    return this.songService.create(createSongDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize?: number,
  ) {
    return this.songService.findAll({ search, page, pageSize });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.songService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: Prisma.SongUpdateInput,
  ) {
    return this.songService.update(id, updateSongDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.songService.delete(id);
  }
}
