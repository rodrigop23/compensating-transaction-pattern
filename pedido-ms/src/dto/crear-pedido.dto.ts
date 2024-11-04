import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CrearPedidoDto {
  @IsNumber()
  clienteId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CrearProductoDto)
  productos: CrearProductoDto[];
}

export class CrearProductoDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;
}
