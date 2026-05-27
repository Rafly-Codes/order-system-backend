import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    createTable(dto: CreateTableDto): Promise<{
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    findAllTables(): Promise<({
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
    findOneTable(id: string): Promise<{
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
    updateTableStatus(id: string, dto: UpdateTableStatusDto): Promise<{
        number: number;
        id: string;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
        qrCode: string;
    }>;
    deleteTable(id: string): Promise<{
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
    startTakeawaySession(customerName: string): Promise<{
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
    getSessionByToken(token: string): Promise<{
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
