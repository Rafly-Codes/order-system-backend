import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Menu ID wajib diisi' })
  menuId: string;

  @IsInt()
  @Min(1, { message: 'Qty minimal 1' })
  qty: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Session token wajib diisi' })
  sessionToken: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  note?: string;
}
