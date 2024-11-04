import { NestFactory } from '@nestjs/core';
import { PagoModule } from './pago.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Pago-Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PagoModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();

  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
