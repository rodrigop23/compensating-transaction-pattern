import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async crearPedido(@Body() crearPedidoDto: CrearPedidoDto) {
    return this.pedidoService.crearPedido(crearPedidoDto);
  }

  @MessagePattern('pedido.revertir')
  async revertirPedido(@Payload('id', ParseIntPipe) id: number) {
    return this.pedidoService.revertirPedido(id);
  }
}
