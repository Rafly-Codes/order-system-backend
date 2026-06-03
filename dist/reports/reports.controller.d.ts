import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(): Promise<{
        today: {
            revenue: number;
            orders: number;
        };
        activeOrders: number;
        availableTables: number;
        totalMenus: number;
    }>;
    getSales(period?: 'today' | 'week' | 'month' | 'year'): Promise<{
        period: "today" | "week" | "month" | "year";
        startDate: Date;
        endDate: Date;
        summary: {
            totalRevenue: number;
            totalOrders: number;
            dineInOrders: number;
            takeawayOrders: number;
            avgOrderValue: number;
        };
    }>;
    getTopMenus(limit?: string, period?: 'today' | 'week' | 'month'): Promise<{
        menu: {
            category: {
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
        };
        totalQty: number;
        totalOrders: number;
        totalRevenue: number;
    }[]>;
    getTableStats(): Promise<{
        id: string;
        number: number;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        totalSessions: number;
        totalRevenue: number;
    }[]>;
}
