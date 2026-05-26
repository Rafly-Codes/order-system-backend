import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: 'Status tidak valid. Pilih: PENDING, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED',
  })
  status: OrderStatus;
}
