import { Module } from '@nestjs/common';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [InventarioController],
  providers: [InventarioService, PrismaService],
})
export class InventarioModule {}
