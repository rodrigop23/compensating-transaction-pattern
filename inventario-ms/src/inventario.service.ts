import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NATS_SERVICE } from './config/services';
import { ClientProxy } from '@nestjs/microservices';
import { ReducirInventarioDto } from './dto/reducir-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async reducirInventario(reducirInventarioDto: ReducirInventarioDto) {
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

    try {
      if (results.length != reducirInventarioDto.productos.length) {
        throw new HttpException(
          'Error updating inventory',
          HttpStatus.BAD_REQUEST,
        );
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

      this.client.emit('pago.crear', {
        totalPrice,
        id: reducirInventarioDto.id,
      });
    } catch (error) {
      const revertChanges = reducirInventarioDto.productos.map((item) =>
        this.revertirActualizacionInventario(item.name, item.quantity),
      );

      await Promise.all(revertChanges);

      this.client.emit('pedido.revertir.creacion', {
        id: reducirInventarioDto.id,
      });

      console.log(error);

      throw new HttpException(
        'Error updating inventory',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revertirActualizacionInventario(name: string, quantity: number) {
    const findItem = await this.prisma.inventario.findFirst({
      where: { name },
    });

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
