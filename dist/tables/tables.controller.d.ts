import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
export declare class TablesController {
    private tablesService;
    constructor(tablesService: TablesService);
    findAll(): Promise<({
        sessions: {
            id: string;
            createdAt: Date;
            orderType: import(".prisma/client").$Enums.OrderType;
        }[];
    } & {
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    })[]>;
    findOne(id: string): Promise<{
        sessions: ({
            orders: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                sessionId: string;
                queueNumber: number | null;
                note: string | null;
                totalAmount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            token: string;
            isActive: boolean;
            expiredAt: Date;
        })[];
    } & {
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    create(dto: CreateTableDto): Promise<{
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    updateStatus(id: string, dto: UpdateTableStatusDto): Promise<{
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    remove(id: string): Promise<{
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    startSessionByQr(qrCode: string): Promise<{
        table: {
            number: number;
            id: string;
            capacity: number;
            status: import(".prisma/client").$Enums.TableStatus;
            qrCode: string;
        };
        session: {
            id: string;
            createdAt: Date;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            token: string;
            isActive: boolean;
            expiredAt: Date;
        };
        isNew: boolean;
    }>;
    startTakeaway(customerName: string): Promise<{
        session: {
            id: string;
            createdAt: Date;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            token: string;
            isActive: boolean;
            expiredAt: Date;
        };
    }>;
    getSession(token: string): Promise<{
        table: {
            number: number;
            id: string;
            capacity: number;
            status: import(".prisma/client").$Enums.TableStatus;
            qrCode: string;
        };
        orders: ({
            orderItems: ({
                menu: {
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
            } & {
                id: string;
                price: number;
                note: string | null;
                orderId: string;
                menuId: string;
                qty: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            sessionId: string;
            queueNumber: number | null;
            note: string | null;
            totalAmount: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        tableId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType;
        customerName: string | null;
        token: string;
        isActive: boolean;
        expiredAt: Date;
    }>;
    endSession(token: string): Promise<{
        id: string;
        createdAt: Date;
        tableId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType;
        customerName: string | null;
        token: string;
        isActive: boolean;
        expiredAt: Date;
    }>;
}
