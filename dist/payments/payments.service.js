"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const order_gateway_1 = require("../gateway/order.gateway");
let PaymentsService = class PaymentsService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async checkout(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: { include: { menu: true } },
                session: { select: { orderType: true, customerName: true, token: true, table: { select: { number: true } } } },
                payment: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order tidak ditemukan');
        if (order.status === client_1.OrderStatus.CANCELLED)
            throw new common_1.BadRequestException('Order sudah dibatalkan');
        if (order.payment?.status === client_1.PaymentStatus.PAID)
            throw new common_1.BadRequestException('Order sudah dibayar');
        if (order.session.orderType === 'DINE_IN' &&
            order.status !== client_1.OrderStatus.SERVED &&
            order.status !== client_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('Pesanan dine-in harus sudah disajikan sebelum bayar');
        }
        const payment = await this.prisma.payment.upsert({
            where: { orderId },
            create: {
                orderId,
                midtransOrderId: `ORDER-${Date.now()}`,
                amount: order.totalAmount,
                status: client_1.PaymentStatus.PENDING,
            },
            update: { status: client_1.PaymentStatus.PENDING },
        });
        const qrisUrl = process.env.QRIS_IMAGE_URL ?? null;
        return {
            orderId: order.id,
            paymentId: payment.id,
            amount: order.totalAmount,
            orderItems: order.orderItems.map((i) => ({ name: i.menu.name, qty: i.qty, price: i.price })),
            customerName: order.session.customerName ?? `Meja ${order.session.table?.number}`,
            paymentMethods: {
                tunai: { description: 'Bayar tunai ke kasir, kasir akan konfirmasi pembayaran' },
                qris: { imageUrl: qrisUrl, description: 'Scan QRIS lalu tunjukkan bukti ke kasir' },
            },
        };
    }
    async confirmPayment(paymentId, method) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: { include: { session: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment tidak ditemukan');
        if (payment.status === client_1.PaymentStatus.PAID)
            throw new common_1.BadRequestException('Sudah dikonfirmasi sebelumnya');
        await this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: client_1.PaymentStatus.PAID, paidAt: new Date() },
        });
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: { status: client_1.OrderStatus.COMPLETED },
        });
        if (payment.order.session.orderType === 'DINE_IN' && payment.order.session.tableId) {
            await this.prisma.table.update({
                where: { id: payment.order.session.tableId },
                data: { status: 'KOTOR' },
            });
            await this.prisma.session.update({
                where: { id: payment.order.sessionId },
                data: { isActive: false },
            });
        }
        this.gateway.emitPaymentConfirmed(payment.orderId, payment.order.session.token);
        return { message: 'Pembayaran berhasil dikonfirmasi', method, paidAt: new Date() };
    }
    async cancelPayment(paymentId) {
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment)
            throw new common_1.NotFoundException('Payment tidak ditemukan');
        if (payment.status === client_1.PaymentStatus.PAID)
            throw new common_1.BadRequestException('Tidak bisa batalkan payment yang sudah lunas');
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: client_1.PaymentStatus.FAILED },
        });
    }
    async getPaymentByOrderId(orderId) {
        const payment = await this.prisma.payment.findUnique({
            where: { orderId },
            include: { order: { select: { status: true, totalAmount: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment tidak ditemukan');
        return payment;
    }
    async getPaymentHistory(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                skip,
                take: limit,
                include: {
                    order: {
                        include: {
                            session: { select: { orderType: true, customerName: true, table: { select: { number: true } } } },
                            orderItems: { include: { menu: { select: { name: true } } } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.payment.count(),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    getQrisInfo() {
        return {
            qrisImageUrl: process.env.QRIS_IMAGE_URL ?? null,
            message: process.env.QRIS_IMAGE_URL
                ? 'QRIS aktif'
                : 'QRIS belum disetup. Tambahkan QRIS_IMAGE_URL di .env',
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        order_gateway_1.OrderGateway])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map