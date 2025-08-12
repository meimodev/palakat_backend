import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from '../../common/pagination/pagination.decorator';
import { PaginationParams } from '../../common/pagination/pagination.types';

@UseGuards(AuthGuard('jwt'))
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  async create(@Body() createMembershipDto: Prisma.MembershipCreateInput) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  async findAll(
    @Query('columnId') columnId?: string,
    @Query('churchId') churchId?: string,
    @Pagination() pagination?: PaginationParams,
  ) {
    const columnIdNum = columnId ? parseInt(columnId, 10) : undefined;
    const churchIdNum = churchId ? parseInt(churchId, 10) : undefined;

    return this.membershipService.findAll({
      churchId: churchIdNum,
      columnId: columnIdNum,
      skip: pagination?.skip ?? 0,
      take: pagination?.take ?? 20,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembershipDto: Prisma.MembershipUpdateInput,
  ) {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.remove(id);
  }
}
