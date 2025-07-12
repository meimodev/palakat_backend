import {
    Body,
    Post,
    Get,
    Query,
    Patch,
    Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SongsService } from './songs.service';

@UseGuards(AuthGuard('jwt'))
@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) { }

    @Post()
    async create(@Body() createSongDto: Prisma.SongsCreateInput) {
        return this.songsService.create(createSongDto);
    }

    @Get()
    async findAll(@Query('text') text?: string) {
        return this.songsService.findAll(text);
    }

    @Get(':id')
    async findOne(@Query('id') id: number) {
        return this.songsService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Query('id') id: number,
        @Body() updateSongDto: Prisma.SongsUpdateInput,
    ) {
        return this.songsService.update(id, updateSongDto);
    }

    @Delete(':id')
    async delete(@Query('id') id: number) {
        return this.songsService.delete(id);
    }
}
