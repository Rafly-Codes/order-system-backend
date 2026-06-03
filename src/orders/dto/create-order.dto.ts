import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '@prisma/client';

export enum PaymentMethod {
  CASH = 'CASH',
  QRIS = 'QRIS',
}

export class OrderItemDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Menu ID wajib diisi' })
  menuId: string;

  @IsInt()
  @Min(1, { message: 'Qty minimal 1' })
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @IsEnum(OrderType, { message: 'orderType harus DINE_IN atau TAKEAWAY' })
  orderType: OrderType;

  @IsEnum(PaymentMethod, { message: 'paymentMethod harus CASH atau QRIS' })
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  note?: string;

  // field tambahan dari frontend (diabaikan tapi diterima)
  @IsString()
  @IsOptional()
  tableId?: string;
}
