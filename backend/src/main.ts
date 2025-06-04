import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  app.enableCors({
    origin: "http://bolosti.labcmi.org.br:3000"
    // origin: "http://localhost:3000"
  })
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
