import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from './account/account.module';
import { PrismaExceptionFilter } from './exception.filter';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService,Logger,PrismaExceptionFilter],
})
export class AppModule {}
