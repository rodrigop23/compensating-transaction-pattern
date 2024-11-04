import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { NATS_SERVICE } from './config/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PedidoService {
  logger = new Logger('PedidoService');

  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async crearPedido(crearPedidoDto: CrearPedidoDto) {
    this.logger.log('Creating order');
    this.logger.log(crearPedidoDto);

    const pedido = await this.prisma.pedido.create({
      data: {
        clienteId: crearPedidoDto.clienteId,
        productos: {
          createMany: {
            data: crearPedidoDto.productos.map((producto) => ({
              name: producto.name,
              quantity: producto.quantity,
            })),
          },
        },
      },
      select: {
        id: true,
        clienteId: true,
        productos: {
          select: {
            name: true,
            quantity: true,
          },
        },
      },
    });

    try {
      // throw new Error('Error creating order');

      this.logger.log('pedido: ', pedido);

      this.client.emit('inventario.reducir', pedido);

      return pedido;
    } catch (error) {
      await this.revertirCreacionPedido(pedido.id);

      this.logger.error(error);

      throw new HttpException(
        'Error creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revertirCreacionPedido(id: number) {
    this.logger.log('Reverting order creation');

    const pedido = this.prisma.pedido.update({
      where: { id },
      data: { isDeleted: true },
    });

    return pedido;
  }

  async completarPedido(id: number) {
    this.logger.log('Completing order');

    const pedido = this.prisma.pedido.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    return pedido;
  }
}
