import { IsEnum } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class UpdateTableStatusDto {
  @IsEnum(TableStatus, { message: 'Status tidak valid. Pilih: TERSEDIA, TERISI, atau KOTOR' })
  status: TableStatus;
}
