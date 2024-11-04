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
        where: { id: item.id },
        data: { quantity: item.quantity },
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
          id: {
            in: reducirInventarioDto.productos.map((item) => item.id),
          },
        },
        select: {
          price: true,
          id: true,
        },
      });

      const totalPrice = prices.reduce(
        (acc, item) =>
          acc +
          reducirInventarioDto.productos.find((i) => i.id === item.id)
            .quantity *
            item.price,
        0,
      );

      this.client.emit('pago.crear', { totalPrice });
    } catch (error) {
      const revertChanges = reducirInventarioDto.productos.map((item) =>
        this.revertirActualizacionInventario(item.id, item.quantity),
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

  async revertirActualizacionInventario(id: string, quantity: number) {
    await this.prisma.inventario.update({
      where: { id },
      data: { quantity },
    });

    this.client.emit('pedido.revertir.creacion', { totalPrice: 0 });
  }
}
