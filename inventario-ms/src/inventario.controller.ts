import { Controller } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReducirInventarioDto } from './dto/reducir-inventario.dto';

@Controller()
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @MessagePattern('inventario.reducir')
  async reducirInventario(@Payload() crearInventarioDto: ReducirInventarioDto) {
    return this.inventarioService.reducirInventario(crearInventarioDto);
  }
}
