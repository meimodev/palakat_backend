import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
