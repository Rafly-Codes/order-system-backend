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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
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
                    table: {
                        number: number;
                    };
                    orderType: import(".prisma/client").$Enums.OrderType;
                    customerName: string;
                };
                orderItems: ({
                    menu: {
                        name: string;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
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
