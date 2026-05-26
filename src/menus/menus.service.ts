import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // ── KATEGORI ──────────────────────────────────────────────────

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Nama kategori sudah ada');

    return this.prisma.category.create({ data: dto });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { menus: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async deleteCategory(id: string) {
    await this.findCategoryOrFail(id);
    return this.prisma.category.delete({ where: { id } });
  }

  private async findCategoryOrFail(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');
    return category;
  }

  // ── MENU ──────────────────────────────────────────────────────

  async createMenu(dto: CreateMenuDto) {
    await this.findCategoryOrFail(dto.categoryId);
    return this.prisma.menu.create({
      data: dto,
      include: { category: true },
    });
  }

  async findAllMenus(categoryId?: string, available?: boolean) {
    return this.prisma.menu.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(available !== undefined && { isAvailable: available }),
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOneMenu(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  async updateMenu(id: string, dto: UpdateMenuDto) {
    await this.findOneMenu(id);
    if (dto.categoryId) await this.findCategoryOrFail(dto.categoryId);

    return this.prisma.menu.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async deleteMenu(id: string) {
    await this.findOneMenu(id);
    return this.prisma.menu.delete({ where: { id } });
  }

  async toggleAvailability(id: string) {
    const menu = await this.findOneMenu(id);
    return this.prisma.menu.update({
      where: { id },
      data: { isAvailable: !menu.isAvailable },
      include: { category: true },
    });
  }
}
