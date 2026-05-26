import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller()
export class MenusController {
  constructor(private menusService: MenusService) {}

  // ── KATEGORI ─────────────────────────────────────────────────

  // GET /categories — public
  @Get('categories')
  findAllCategories() {
    return this.menusService.findAllCategories();
  }

  // POST /categories — admin only
  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.menusService.createCategory(dto);
  }

  // DELETE /categories/:id — admin only
  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.deleteCategory(id);
  }

  // ── MENU ──────────────────────────────────────────────────────

  // GET /menus — public, bisa filter ?categoryId=xxx&available=true
  @Get('menus')
  findAllMenus(
    @Query('categoryId') categoryId?: string,
    @Query('available') available?: string,
  ) {
    const availableBool =
      available === 'true' ? true : available === 'false' ? false : undefined;
    return this.menusService.findAllMenus(categoryId, availableBool);
  }

  // GET /menus/:id — public
  @Get('menus/:id')
  findOneMenu(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.findOneMenu(id);
  }

  // POST /menus — admin only
  @Post('menus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createMenu(@Body() dto: CreateMenuDto) {
    return this.menusService.createMenu(dto);
  }

  // PATCH /menus/:id — admin only
  @Patch('menus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateMenu(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menusService.updateMenu(id, dto);
  }

  // PATCH /menus/:id/toggle — admin only, toggle stok tersedia/habis
  @Patch('menus/:id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  toggleAvailability(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.toggleAvailability(id);
  }

  // DELETE /menus/:id — admin only
  @Delete('menus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteMenu(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.deleteMenu(id);
  }
}
