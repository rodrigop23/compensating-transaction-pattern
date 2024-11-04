import { Module } from '@nestjs/common';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [PagoController],
  providers: [PagoService, PrismaService],
})
export class PagoModule {}
