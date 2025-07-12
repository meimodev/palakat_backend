import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SongsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createSongDto: Prisma.SongsCreateInput) {
        const song = await this.prisma.songs.create({
            data: createSongDto,
        });
        if (song) {
            return {
                message: 'OK',
                data: song,
            };
        }
    }

    async findAll(text?: string) {
        const where: Prisma.SongsWhereInput = {};

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

        const songs = await this.prisma.songs.findMany({
            where,
            include: {
                parts: true,
            },
        });

        return {
            message: 'OK',
            data: songs,
        };
    }

    async findOne(id: number) {
        const song = await this.prisma.songs.findUnique({
            where: { id: id },
            include: {
                parts: true,
            },
        });

        if (!song) {
            throw new Error('Song not found');
        }

        return {
            message: 'OK',
            data: song,
        };
    }

    async update(id: number, updateSongDto: Prisma.SongsUpdateInput) {
        const song = await this.prisma.songs.update({
            where: { id: id },
            data: updateSongDto,
        });

        if (song) {
            return {
                message: 'OK',
                data: song,
            };
        }
    }

    async delete(id: number) {
        const song = await this.prisma.songs.delete({
            where: { id: id },
        });

        if (song) {
            return {
                message: 'OK',
            };
        }
    }
}
