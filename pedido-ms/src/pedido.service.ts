import { Injectable } from '@nestjs/common';

@Injectable()
export class PedidoService {
  getHello(): string {
    return 'Hello World!';
  }
}
