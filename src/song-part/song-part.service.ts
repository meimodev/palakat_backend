import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SongPartService {
    constructor(private readonly prisma: PrismaService) { }

    async create(songId: number, createSongPartDto: Prisma.SongPartCreateInput) {
        const data = {
            ...createSongPartDto,
            song: { connect: { id: songId } },
        };
        const created = await this.prisma.songPart.create({
            data,
        });
        return {
            message: 'OK',
            data: created,
        };
    }

    async findAll(songId?: number) {
        const where: Prisma.SongPartWhereInput = {};

        if (songId) {
            where.songId = songId;
        }
        const parts = await this.prisma.songPart.findMany({
            where,
        });
        return {
            message: 'OK',
            data: parts
        };
    }

    async findOne(id: number) {
        return this.prisma.songPart.findUnique({ where: { id } });
    }

    async update(id: number, data: Prisma.SongPartUpdateInput) {
        return this.prisma.songPart.update({ where: { id }, data });
    }

    async delete(id: number) {
        return this.prisma.songPart.delete({ where: { id } });
    }
}
