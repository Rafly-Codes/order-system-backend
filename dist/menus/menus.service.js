"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenusService = class MenusService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(dto) {
        const existing = await this.prisma.category.findUnique({
            where: { name: dto.name },
        });
        if (existing)
            throw new common_1.ConflictException('Nama kategori sudah ada');
        return this.prisma.category.create({ data: dto });
    }
    async findAllCategories() {
        return this.prisma.category.findMany({
            include: { _count: { select: { menus: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async deleteCategory(id) {
        await this.findCategoryOrFail(id);
        return this.prisma.category.delete({ where: { id } });
    }
    async findCategoryOrFail(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        return category;
    }
    async createMenu(dto) {
        await this.findCategoryOrFail(dto.categoryId);
        return this.prisma.menu.create({
            data: dto,
            include: { category: true },
        });
    }
    async findAllMenus(categoryId, available) {
        return this.prisma.menu.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(available !== undefined && { isAvailable: available }),
            },
            include: { category: { select: { id: true, name: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOneMenu(id) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu tidak ditemukan');
        return menu;
    }
    async updateMenu(id, dto) {
        await this.findOneMenu(id);
        if (dto.categoryId)
            await this.findCategoryOrFail(dto.categoryId);
        return this.prisma.menu.update({
            where: { id },
            data: dto,
            include: { category: true },
        });
    }
    async deleteMenu(id) {
        await this.findOneMenu(id);
        return this.prisma.menu.delete({ where: { id } });
    }
    async toggleAvailability(id) {
        const menu = await this.findOneMenu(id);
        return this.prisma.menu.update({
            where: { id },
            data: { isAvailable: !menu.isAvailable },
            include: { category: true },
        });
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenusService);
//# sourceMappingURL=menus.service.js.map