import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ChurchService {
  constructor(private prisma: PrismaService) {}
  async getChurches(params: { search?: string; latitude?: string; longitude?: string }) {
    const { search, latitude, longitude } = params;
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;

    let churches = await this.prisma.church.findMany();

    // Sort by distance if lat/long provided
    if (lat != null && lng != null) {
      churches = churches
        .map(church => ({
          ...church,
          distance: this.getDistance(lat, lng, parseFloat(church.latitude), parseFloat(church.longitude)),
        }))
        .sort((a, b) => a.distance - b.distance);
    } else {
      churches = churches.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply search filter (at least 3 consecutive characters match in name or address)
    if (search && search.length >= 3) {
      const keyword = search.toLowerCase();
      churches = churches.filter(
        c =>
          c.name.toLowerCase().includes(keyword) ||
          c.address.toLowerCase().includes(keyword),
      );
    }

    return {
      message: 'Churches fetched successfully',
      data: churches,
    };
  }

  async findOne(id: number ){
    const church = await this.prisma.church.findUniqueOrThrow({
      where: { id },
    });
    return {
      message: 'Church fetched successfully',
      data: church,
    }
  }

  // sakit pala abang 
  // Rumus Haversine 
  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
