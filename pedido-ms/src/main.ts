import { NestFactory } from '@nestjs/core';
import { PedidoModule } from './pedido.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Pedido-Microservice');

  const app = await NestFactory.create(PedidoModule);
  await app.listen(envs.port);

  logger.log(`Pedido Microservice running on port ${envs.port}`);
}
bootstrap();
