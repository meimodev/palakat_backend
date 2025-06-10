import {
  Controller,
  Post,
  Body,
  UseGuards,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')
@UseGuards(AuthGuard('jwt'))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountService.create(createAccountDto);
  }
}
