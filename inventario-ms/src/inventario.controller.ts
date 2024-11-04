import { Controller, Logger } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ReducirInventarioDto } from './dto/reducir-inventario.dto';

@Controller()
export class InventarioController {
  logger = new Logger('InventarioController');

  constructor(private readonly inventarioService: InventarioService) {}

  @MessagePattern('inventario.reducir')
  async reducirInventario(@Payload() crearInventarioDto: ReducirInventarioDto) {
    try {
      this.logger.log('Reducing inventory');
      return this.inventarioService.reducirInventario(crearInventarioDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern('inventario.revertir.reduccion')
  async revertirReduccionInventario(
    @Payload() { name, quantity }: { name: string; quantity: number },
  ) {
    try {
      this.logger.log('Reverting inventory reduction');

      return this.inventarioService.revertirActualizacionInventario(
        name,
        quantity,
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
