import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const httpAdapterHost = app.get(HttpAdapterHost);
  const prismaExceptionFilter = app.get(PrismaExceptionFilter);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(prismaExceptionFilter);

  await app.listen(3000);
}

bootstrap();
