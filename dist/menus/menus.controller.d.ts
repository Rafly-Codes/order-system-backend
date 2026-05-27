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
        name: string;
        createdAt: Date;
    })[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    findAllMenus(categoryId?: string, available?: string): Promise<({
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
}
