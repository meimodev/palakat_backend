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

  async findAll(params?: { songId?: number; page?: number; pageSize?: number }) {
    const { songId, page, pageSize } = params ?? {};

    const where: Prisma.SongPartWhereInput = {};
    if (songId) {
      where.songId = songId;
    }

  const currentPage = Math.max(1, page ?? 1);
  const take = Math.min(Math.max(1, pageSize ?? 20), 100);
  const skip = (currentPage - 1) * take;

  const [total, parts] = await this.prisma.$transaction([
      this.prisma.songPart.count({ where }),
      this.prisma.songPart.findMany({
        where,
    take,
        skip,
        orderBy: { id: 'desc' },
      }),
    ]);

  const totalPages = Math.ceil(total / take);

    return {
      message: 'OK',
      data: parts,
      pagination: {
        page: currentPage,
        pageSize: take,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
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
