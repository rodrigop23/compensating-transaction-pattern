import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ReducirInventarioDto {
  @IsString()
  id: string;

  @IsString()
  clientId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductoDto)
  productos: ProductoDto[];
}

export class ProductoDto {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;
}
