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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { OrderType, PaymentMethod } from '@prisma/client';

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
  @IsEnum(OrderType, { message: 'orderType harus DINE_IN, TAKEAWAY, atau DELIVERY' })
  orderType: OrderType;

  @IsEnum(PaymentMethod, { message: 'paymentMethod harus CASH, QRIS, atau TRANSFER' })
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateIf((o) => o.orderType === 'DELIVERY')
  @IsString()
  @IsNotEmpty({ message: 'deliveryAddress wajib diisi untuk order DELIVERY' })
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
