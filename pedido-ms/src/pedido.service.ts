import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { NATS_SERVICE } from './config/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PedidoService {
  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async crearPedido(crearPedidoDto: CrearPedidoDto) {
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
            id: true,
            quantity: true,
          },
        },
      },
    });

    try {
      this.client.emit('pedido.creado', pedido);

      return pedido;
    } catch (error) {
      await this.revertirCreacionPedido(pedido.id);

      console.log(error);

      throw new HttpException(
        'Error creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revertirCreacionPedido(id: number) {
    const pedido = this.prisma.pedido.update({
      where: { id },
      data: { isDeleted: true },
    });

    return pedido;
  }
}
