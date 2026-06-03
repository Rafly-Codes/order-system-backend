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
        status: import(".prisma/client").$Enums.TableStatus;
        capacity: number;
        qrCode: string;
    })[]>;
    findOne(id: string): Promise<{
        sessions: ({
            orders: {
                id: string;
                sessionId: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                queueNumber: number | null;
                note: string | null;
                totalAmount: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            token: string;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            isActive: boolean;
            expiredAt: Date;
        })[];
    } & {
        number: number;
        id: string;
        status: import(".prisma/client").$Enums.TableStatus;
        capacity: number;
        qrCode: string;
    }>;
    create(dto: CreateTableDto): Promise<{
        number: number;
        id: string;
        status: import(".prisma/client").$Enums.TableStatus;
        capacity: number;
        qrCode: string;
    }>;
    updateStatus(id: string, dto: UpdateTableStatusDto): Promise<{
        number: number;
        id: string;
        status: import(".prisma/client").$Enums.TableStatus;
        capacity: number;
        qrCode: string;
    }>;
    remove(id: string): Promise<{
        number: number;
        id: string;
        status: import(".prisma/client").$Enums.TableStatus;
        capacity: number;
        qrCode: string;
    }>;
    startSessionByQr(qrCode: string): Promise<{
        table: {
            number: number;
            id: string;
            status: import(".prisma/client").$Enums.TableStatus;
            capacity: number;
            qrCode: string;
        };
        session: {
            id: string;
            createdAt: Date;
            token: string;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            isActive: boolean;
            expiredAt: Date;
        };
        isNew: boolean;
    }>;
    startTakeaway(customerName: string): Promise<{
        session: {
            id: string;
            createdAt: Date;
            token: string;
            tableId: string | null;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string | null;
            isActive: boolean;
            expiredAt: Date;
        };
    }>;
    getSession(token: string): Promise<{
        table: {
            number: number;
            id: string;
            status: import(".prisma/client").$Enums.TableStatus;
            capacity: number;
            qrCode: string;
        };
        orders: ({
            orderItems: ({
                menu: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    price: number;
                    imageUrl: string | null;
                    isAvailable: boolean;
                    categoryId: string;
                };
            } & {
                id: string;
                note: string | null;
                price: number;
                orderId: string;
                menuId: string;
                qty: number;
            })[];
        } & {
            id: string;
            sessionId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            queueNumber: number | null;
            note: string | null;
            totalAmount: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        token: string;
        tableId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType;
        customerName: string | null;
        isActive: boolean;
        expiredAt: Date;
    }>;
    endSession(token: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        tableId: string | null;
        orderType: import(".prisma/client").$Enums.OrderType;
        customerName: string | null;
        isActive: boolean;
        expiredAt: Date;
    }>;
}
