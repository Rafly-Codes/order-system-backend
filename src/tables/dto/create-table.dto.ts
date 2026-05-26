import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  @Min(1, { message: 'Nomor meja minimal 1' })
  number: number;

  @IsInt()
  @Min(1, { message: 'Kapasitas minimal 1' })
  capacity: number;
}
