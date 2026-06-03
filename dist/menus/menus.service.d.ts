import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class MenusService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }>;
    findAllCategories(): Promise<({
        _count: {
            menus: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
    })[]>;
    deleteCategory(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }>;
    private findCategoryOrFail;
    createMenu(dto: CreateMenuDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    findAllMenus(categoryId?: string, available?: boolean): Promise<({
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    })[]>;
    findOneMenu(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    updateMenu(id: string, dto: UpdateMenuDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    deleteMenu(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    toggleAvailability(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
}
