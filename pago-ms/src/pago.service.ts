import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NATS_SERVICE } from './config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
// import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagoService {
  logger = new Logger('PagoService');

  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async crearPago(crearPagoDto: any) {
    this.logger.log('Crear pago');

    const nuevoPago = await this.prisma.pago.create({
      data: {
        pedidoId: crearPagoDto.pedido.id,
        monto: crearPagoDto.monto,
      },
      select: {
        pedidoId: true,
      },
    });
    try {
      throw new Error('Error');

      this.client.emit('pedido.completado', nuevoPago.pedidoId);
    } catch (error) {
      this.logger.error(error);

      crearPagoDto.pedido.productos.map((item) =>
        this.client.emit('inventario.revertir.reduccion', {
          name: item.name,
          quantity: item.quantity,
        }),
      );

      this.client.emit('pedido.revertir.creacion', {
        id: crearPagoDto.pedido.id,
      });

      throw new RpcException('Error al crear el pago');
    }
  }
}
