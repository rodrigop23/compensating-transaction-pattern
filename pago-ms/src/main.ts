import { NestFactory } from '@nestjs/core';
import { PagoModule } from './pago.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Pago-Microservice');

  const app = await NestFactory.create(PagoModule);
  await app.listen(envs.port);

  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
