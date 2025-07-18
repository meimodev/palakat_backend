import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { HelperService } from 'common/helper/helper.service';

@Injectable()
export class ChurchService {
  constructor(private prisma: PrismaService, private helperService: HelperService) {}
  async getChurches(params: {
    search?: string;
    latitude?: string;
    longitude?: string;
  }) {
    const { search, latitude, longitude } = params;
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;

    let churches = await this.prisma.church.findMany();

    // Sort by distance if lat/long provided
    if (lat != null && lng != null) {
      churches = churches
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
    } else {
      churches = churches.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply search filter (at least 3 consecutive characters match in name or address)
    if (search && search.length >= 3) {
      const keyword = search.toLowerCase();
      churches = churches.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          c.address.toLowerCase().includes(keyword),
      );
    }

    return {
      message: 'Churches fetched successfully',
      data: churches,
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
