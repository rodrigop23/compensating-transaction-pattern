import { IsNumber, IsPositive } from 'class-validator';

export class CrearPagoDto {
  pedido: any;

  @IsNumber()
  @IsPositive()
  monto: number;
}
