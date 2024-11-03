import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client/prisma-client.service';

@Injectable()
export class PagoService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
