import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama menu tidak boleh kosong' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Kategori wajib diisi' })
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
