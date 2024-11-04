import { Module } from '@nestjs/common';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [PedidoController],
  providers: [PedidoService, PrismaService],
})
export class PedidoModule {}
