import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

// Sesuaikan dengan enum dari Prisma / App kamu
export enum Role {
  ADMIN = 'ADMIN',
  KASIR = 'KASIR',
  PELANGGAN = 'PELANGGAN',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(Role, { message: 'Role harus berupa ADMIN, KASIR, atau PELANGGAN' })
  @IsOptional() // Opsional jika ingin ada default di level code/DB
  role?: Role;
}