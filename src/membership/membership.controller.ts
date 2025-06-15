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
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  async create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  async findAll(
    @Query('column_id') columnId?: string,
    @Query('church_id') churchId?: string,
  ) {
    const columnIdNum = columnId ? parseInt(columnId, 10) : undefined;
    const churchIdNum = churchId ? parseInt(churchId, 10) : undefined;
    
    return this.membershipService.findAll(churchIdNum, columnIdNum);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.membershipService.remove(id);
  }
}