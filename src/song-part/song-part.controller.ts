import {
  Body,
  Post,
  Get,
  Query,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SongPartService } from './song-part.service';

@UseGuards(AuthGuard('jwt'))
@Controller('song-part')
export class SongPartController {
  constructor(private readonly songPartService: SongPartService) {}

  @Post()
  async create(
    @Body('index') index: number,
    @Body('name') name: string,
    @Body('content') content: string,
    @Body('song_id') song_id: number,
  ) {
    return this.songPartService.create(index, name, content, song_id);
  }

  @Get()
  async findAll(
    @Query('song_id', new ParseIntPipe({ optional: true })) songId?: number,
  ) {
    return this.songPartService.findAll(songId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.songPartService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongPartDto: Prisma.SongPartUpdateInput,
  ) {
    return this.songPartService.update(id, updateSongPartDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.songPartService.delete(id);
  }
}
