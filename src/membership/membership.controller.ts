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
  DefaultValuePipe,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize?: number,
  ) {
    const columnIdNum = columnId ? parseInt(columnId, 10) : undefined;
    const churchIdNum = churchId ? parseInt(churchId, 10) : undefined;

    return this.membershipService.findAll(
      churchIdNum,
      columnIdNum,
      page,
      pageSize,
    );
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
