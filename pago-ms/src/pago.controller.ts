import { Controller } from '@nestjs/common';
import { PagoService } from './pago.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Controller()
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @MessagePattern('pago.crear')
  async crearPago(@Payload() crearPagoDto: CrearPagoDto) {
    return this.pagoService.crearPago(crearPagoDto);
  }
}
