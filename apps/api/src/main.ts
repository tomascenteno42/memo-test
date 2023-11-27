import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('EntryPoint');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.enableCors();

  const PORT = 5002;

  await app.listen(PORT);
  logger.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();
