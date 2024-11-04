import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';
import { NATS_SERVICE } from './config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagoService {
  constructor(
    private prisma: PrismaService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async crearPago(crearPagoDto: CrearPagoDto) {
    try {
      await this.prisma.pago.create({
        data: {
          pedidoId: crearPagoDto.pedidoId,
          monto: crearPagoDto.monto,
        },
      });
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Error al crear el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
