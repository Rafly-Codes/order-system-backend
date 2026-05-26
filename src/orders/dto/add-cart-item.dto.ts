import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
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

export class UpdateCartItemDto {
  @IsInt()
  @Min(0, { message: 'Qty minimal 0 (0 = hapus item)' })
  qty: number;

  @IsString()
  @IsOptional()
  note?: string;
}
