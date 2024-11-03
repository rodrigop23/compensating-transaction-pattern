import { Controller, Get } from '@nestjs/common';
import { PedidoService } from './pedido.service';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get()
  getHello(): string {
    return this.pedidoService.getHello();
  }
}
