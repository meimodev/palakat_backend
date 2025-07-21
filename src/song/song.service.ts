import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SongService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createSongDto: Prisma.SongCreateInput) {
        await this.prisma.song.create({
            data: createSongDto,
        });
        return {
            message: 'OK',
            data: createSongDto,
        };
    }

    async findAll(text?: string) {
        const where: Prisma.SongWhereInput = {};

        if (text) {
            where.OR = [
                {
                    title: {
                        contains: text,
                        mode: 'insensitive'
                    }
                },
                {
                    parts: {
                        some: {
                            content: {
                                contains: text,
                                mode: 'insensitive',
                            },
                        },
                    },
                }
            ]
        }

        const song = await this.prisma.song.findMany({
            where,
            include: {
                parts: true,
            },
        });

        return {
            message: 'OK',
            data: song,
        };
    }

    async findOne(id: number) {
        const song = await this.prisma.song.findUniqueOrThrow({
            where: { id: id },
            include: {
                parts: true,
            },
        });

        return {
            message: 'OK',
            data: song,
        };
    }

    async update(id: number, updateSongDto: Prisma.SongUpdateInput) {
        await this.prisma.song.update({
            where: { id: id },
            data: updateSongDto,
        });
        return {
            message: 'OK',
            data: updateSongDto,
        };
    }

    async delete(id: number) {
        await this.prisma.song.delete({
            where: { id: id },
        });
        return {
            message: 'OK',
        };
    }
}
