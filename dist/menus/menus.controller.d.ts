import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class MenusController {
    private menusService;
    constructor(menusService: MenusService);
    findAllCategories(): Promise<({
        _count: {
            menus: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
    })[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }>;
    findAllMenus(categoryId?: string, available?: string): Promise<({
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
}
