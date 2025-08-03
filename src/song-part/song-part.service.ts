import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SongPartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Prisma.SongPartCreateInput) {
    const SongPart = await this.prisma.songPart.create({
      data: dto,
    });

    return {
      message: 'OK',
      data: SongPart,
    };
  }

  async findAll(song_id?: number) {
    const where: Prisma.SongPartWhereInput = {};

    if (song_id) {
      where.songId = song_id;
    }
    const parts = await this.prisma.songPart.findMany({
      where,
    });
    return {
      message: 'OK',
      data: parts,
    };
  }

  async findOne(id: number) {
    const Songpart = await this.prisma.songPart.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: 'OK',
      data: Songpart,
    };
  }

  async update(id: number, updateSongPartDto: Prisma.SongPartUpdateInput) {
    await this.prisma.songPart.update({
      where: { id },
      data: updateSongPartDto,
    });
    return {
      message: 'OK',
      data: updateSongPartDto,
    };
  }

  async delete(id: number) {
    await this.prisma.songPart.delete({
      where: { id },
    });
    return {
      message: 'OK',
    };
  }
}
