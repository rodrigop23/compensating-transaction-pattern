import { IsDecimal, IsNumber, IsPositive } from 'class-validator';

export class CrearPagoDto {
  @IsNumber()
  @IsPositive()
  pedidoId: number;

  @IsDecimal()
  @IsPositive()
  monto: number;
}
