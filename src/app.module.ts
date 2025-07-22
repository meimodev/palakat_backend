import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from './account/account.module';
import { PrismaExceptionFilter } from './exception.filter';
import { MembershipModule } from './membership/membership.module';
import { ActivitiesModule } from './activity/activity.module';
import { ChurchModule } from './church/church.module';
import { HelperService } from '../common/helper/helper.service';
import { SongModule } from './song/song.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    AccountModule,
    MembershipModule,
    ActivitiesModule,
    ChurchModule,
    SongModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, PrismaExceptionFilter, HelperService],
  exports: [HelperService],
})
export class AppModule { }
