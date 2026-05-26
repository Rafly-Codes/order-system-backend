import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

class UpdateUserDto {
  @IsEnum(Role, { message: 'Role tidak valid. Pilih: ADMIN, KASIR, PELANGGAN' })
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  name?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users — semua user
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id — detail user
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  // PATCH /users/:id/role — promote/demote role user
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto);
  }

  // DELETE /users/:id — hapus user
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
