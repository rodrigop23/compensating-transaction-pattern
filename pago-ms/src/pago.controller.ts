import { Controller, Get } from '@nestjs/common';
import { PagoService } from './pago.service';

@Controller()
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Get()
  getHello(): string {
    return this.pagoService.getHello();
  }
}
