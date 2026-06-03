import { PrismaService } from '../prisma/prisma.service';
import { OrderGateway } from '../gateway/order.gateway';
export declare class PaymentsService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: OrderGateway);
    checkout(orderId: string): Promise<{
        orderId: string;
        paymentId: string;
        amount: number;
        orderItems: {
            name: string;
            qty: number;
            price: number;
        }[];
        customerName: string;
        paymentMethods: {
            tunai: {
                description: string;
            };
            qris: {
                imageUrl: string;
                description: string;
            };
        };
    }>;
    confirmPayment(paymentId: string, method: 'TUNAI' | 'QRIS'): Promise<{
        message: string;
        method: "TUNAI" | "QRIS";
        paidAt: Date;
    }>;
    cancelPayment(paymentId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        snapToken: string | null;
        midtransOrderId: string;
        amount: number;
        paidAt: Date | null;
    }>;
    getPaymentByOrderId(orderId: string): Promise<{
        order: {
            status: import(".prisma/client").$Enums.OrderStatus;
            totalAmount: number;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        snapToken: string | null;
        midtransOrderId: string;
        amount: number;
        paidAt: Date | null;
    }>;
    getPaymentHistory(page?: number, limit?: number): Promise<{
        data: ({
            order: {
                session: {
                    orderType: import(".prisma/client").$Enums.OrderType;
                    customerName: string;
                    table: {
                        number: number;
                    };
                };
                orderItems: ({
                    menu: {
                        name: string;
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
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getQrisInfo(): {
        qrisImageUrl: string;
        message: string;
    };
}
