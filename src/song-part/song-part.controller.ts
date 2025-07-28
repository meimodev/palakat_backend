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
    constructor(private readonly songPartService: SongPartService) { }

    @Post(':songId')
    async create(@Param('songId', ParseIntPipe) songId: number, @Body() createSongPartDto: Prisma.SongPartCreateInput) {
        return this.songPartService.create(songId, createSongPartDto);
    }

    @Get()
    async findAll(@Query('song_id', new ParseIntPipe({ optional: true })) songId?: number) {
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
