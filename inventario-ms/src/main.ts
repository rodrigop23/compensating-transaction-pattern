import { NestFactory } from '@nestjs/core';
import { InventarioModule } from './inventario.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Inventario-Microservice');

  const app = await NestFactory.create(InventarioModule);
  await app.listen(envs.port);

  logger.log(`Inventario Microservice running on port ${envs.port}`);
}
bootstrap();
