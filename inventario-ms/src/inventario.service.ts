import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NATS_SERVICE } from './config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ReducirInventarioDto } from './dto/reducir-inventario.dto';

@Injectable()
export class InventarioService {
  logger = new Logger('InventarioService');

  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async reducirInventario(reducirInventarioDto: ReducirInventarioDto) {
    this.logger.log('Reducing inventory');

    const updatePromises = reducirInventarioDto.productos.map((item) =>
      this.prisma.inventario.updateMany({
        where: { name: item.name },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      }),
    );

    const results = await Promise.all(updatePromises);

    this.logger.log(results);

    try {
      // throw new Error('Error updating inventory');

      if (results[0].count != reducirInventarioDto.productos.length) {
        throw new RpcException('Error updating inventory');
      }

      const prices = await this.prisma.inventario.findMany({
        where: {
          name: {
            in: reducirInventarioDto.productos.map((item) => item.name),
          },
        },
        select: {
          price: true,
          name: true,
        },
      });

      const totalPrice = prices.reduce(
        (acc, item) =>
          acc +
          reducirInventarioDto.productos.find((i) => i.name === item.name)
            .quantity *
            item.price,
        0,
      );

      const dataToSend = {
        pedido: reducirInventarioDto,
        monto: totalPrice,
      };

      this.logger.log(dataToSend);

      this.client.emit('pago.crear', dataToSend);
    } catch (error) {
      const revertChanges = reducirInventarioDto.productos.map((item) =>
        this.revertirActualizacionInventario(item.name, item.quantity),
      );

      await Promise.all(revertChanges);

      this.client.emit('pedido.revertir.creacion', {
        id: reducirInventarioDto.id,
      });

      console.log(error);

      throw new RpcException('Error updating inventory');
    }
  }

  async revertirActualizacionInventario(name: string, quantity: number) {
    this.logger.log('Reverting inventory update');

    const findItem = await this.prisma.inventario.findFirst({
      where: { name },
    });

    this.logger.log(findItem);

    await this.prisma.inventario.update({
      where: { id: findItem.id },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }
}
