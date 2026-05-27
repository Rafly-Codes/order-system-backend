import { PaymentsService } from './payments.service';
declare class ConfirmPaymentDto {
    method: 'TUNAI' | 'QRIS';
}
declare class CheckoutDto {
    orderId: string;
}
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    checkout(dto: CheckoutDto): Promise<{
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
    confirm(id: string, dto: ConfirmPaymentDto): Promise<{
        message: string;
        method: "TUNAI" | "QRIS";
        paidAt: Date;
    }>;
    cancel(id: string): Promise<{
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
    getQris(): {
        qrisImageUrl: string;
        message: string;
    };
    getHistory(page?: string, limit?: string): Promise<{
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
    getStatus(orderId: string): Promise<{
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
}
export {};
