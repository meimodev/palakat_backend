import {
  Controller,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountService.create(createAccountDto);
  }
}
