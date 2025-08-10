import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSongDto: Prisma.SongCreateInput) {
    await this.prisma.song.create({
      data: createSongDto,
    });
    return {
      message: 'OK',
      data: createSongDto,
    };
  }

  async findAll(params: { search?: string; page?: number; pageSize?: number }) {
    const { search, page, pageSize } = params ?? {};

    const where: Prisma.SongWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          parts: {
            some: {
              content: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    const currentPage = Math.max(1, page ?? 1);
    const take = Math.min(Math.max(1, pageSize ?? 20), 100);
    const skip = (currentPage - 1) * take;

    const [total, songs] = await this.prisma.$transaction([
      this.prisma.song.count({ where }),
      this.prisma.song.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' },
        include: {
          parts: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / take);

    return {
      message: 'OK',
      data: songs,
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
