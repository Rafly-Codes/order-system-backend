import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class MenusService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    findAllCategories(): Promise<({
        _count: {
            menus: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
    })[]>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    private findCategoryOrFail;
    createMenu(dto: CreateMenuDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    }>;
    findAllMenus(categoryId?: string, available?: boolean): Promise<({
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    })[]>;
    findOneMenu(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    }>;
    updateMenu(id: string, dto: UpdateMenuDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    }>;
    deleteMenu(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    }>;
    toggleAvailability(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string;
        isAvailable: boolean;
    }>;
}
