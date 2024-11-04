import { Controller, Logger } from '@nestjs/common';
import { PagoService } from './pago.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
// import { CrearPagoDto } from './dto/crear-pago.dto';

@Controller()
export class PagoController {
  logger = new Logger('PagoController');

  constructor(private readonly pagoService: PagoService) {}

  @MessagePattern('pago.crear')
  async crearPago(@Payload() crearPagoDto: any) {
    this.logger.log('Creating payment');

    return this.pagoService.crearPago(crearPagoDto);
  }
}
