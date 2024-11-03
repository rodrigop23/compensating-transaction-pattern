import { Injectable } from '@nestjs/common';

@Injectable()
export class PagoService {
  getHello(): string {
    return 'Hello World!';
  }
}
