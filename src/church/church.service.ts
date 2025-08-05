import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { HelperService } from 'common/helper/helper.service';

@Injectable()
export class ChurchService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelperService,
  ) {}
  async getChurches(params: {
    search?: string;
    latitude?: string;
    longitude?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { search, latitude, longitude, page, pageSize } = params;

    const take = Math.min(pageSize, 100);
    const skip = (page - 1) * take;

    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;

    // Apply search filter at database level
    const where: Prisma.ChurchWhereInput = {};
    if (search && search.length >= 3) {
      const keyword = search.toLowerCase();
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    let churches = [];
    let total: number;

    if (lat != null && lng != null) {
      const [totalCount, allChurchesData] = await this.prisma.$transaction([
        this.prisma.church.count({ where }),
        this.prisma.church.findMany({ where }),
      ]);

      total = totalCount;

      // Calculate distance and sort
      const churchesWithDistance = allChurchesData
        .map((church) => ({
          ...church,
          distance: this.helperService.calculateDistance(
            lat,
            lng,
            parseFloat(church.latitude),
            parseFloat(church.longitude),
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      // Apply pagination AFTER sorting
      churches = churchesWithDistance.slice(skip, skip + take);
    } else {
      const [totalCount, churchesData] = await this.prisma.$transaction([
        this.prisma.church.count({ where }),
        this.prisma.church.findMany({
          where,
          take,
          skip,
          orderBy: { name: 'asc' },
        }),
      ]);

      total = totalCount;
      churches = churchesData;
    }

    const totalPages = Math.ceil(total / take);

    return {
      message: 'Churches fetched successfully',
      data: churches,
      pagination: {
        page: page,
        pageSize: take,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const church = await this.prisma.church.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: 'Church fetched successfully',
      data: church,
    };
  }

  async remove(id: number) {
    await this.prisma.church.delete({
      where: { id },
    });
    return {
      message: 'Church deleted successfully',
    };
  }

  async create(createChurchDto: Prisma.ChurchCreateInput) {
    const church = await this.prisma.church.create({
      data: createChurchDto,
    });
    return {
      message: 'Church created successfully',
      data: church,
    };
  }

  async update(id: number, updateChurchDto: Prisma.ChurchUpdateInput) {
    const church = await this.prisma.church.update({
      where: { id },
      data: updateChurchDto,
    });
    return {
      message: 'Church updated successfully',
      data: church,
    };
  }
}
