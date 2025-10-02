import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Patch,
  ParseIntPipe,
  Delete,
  Param,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { AccountListQueryDto } from './dto/account-list.dto';
import { AccountCountQueryDto } from './dto/account-count.dto';

@Controller('account')
@UseGuards(AuthGuard('jwt'))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAll(@Query() query: AccountListQueryDto) {
    return this.accountService.findAll(query);
  }

  @Get('count')
  async count(@Query() query: AccountCountQueryDto) {
    return this.accountService.count(query);
  }

  @Post()
  create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountService.create(createAccountDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: Prisma.AccountUpdateInput,
  ) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.accountService.delete(id);
  }
}
