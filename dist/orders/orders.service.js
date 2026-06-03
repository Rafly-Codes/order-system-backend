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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const order_gateway_1 = require("../gateway/order.gateway");
let OrdersService = class OrdersService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async getActiveSession(sessionToken) {
        const session = await this.prisma.session.findUnique({
            where: { token: sessionToken },
        });
        if (!session)
            throw new common_1.NotFoundException('Sesi tidak ditemukan');
        if (!session.isActive)
            throw new common_1.BadRequestException('Sesi sudah tidak aktif');
        if (new Date() > session.expiredAt)
            throw new common_1.BadRequestException('Sesi sudah expired');
        return session;
    }
    async getPendingCart(sessionId) {
        return this.prisma.order.findFirst({
            where: { sessionId, status: client_1.OrderStatus.PENDING },
            include: {
                orderItems: {
                    include: { menu: { select: { id: true, name: true, price: true, isAvailable: true } } },
                },
            },
        });
    }
    async recalcTotal(orderId) {
        const items = await this.prisma.orderItem.findMany({ where: { orderId } });
        const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        return this.prisma.order.update({ where: { id: orderId }, data: { totalAmount: total } });
    }
    async getCart(sessionToken) {
        const session = await this.getActiveSession(sessionToken);
        const cart = await this.getPendingCart(session.id);
        if (!cart)
            return { items: [], totalAmount: 0, message: 'Keranjang kosong' };
        return cart;
    }
    async addCartItem(sessionToken, dto) {
        const session = await this.getActiveSession(sessionToken);
        const menu = await this.prisma.menu.findUnique({ where: { id: dto.menuId } });
        if (!menu)
            throw new common_1.NotFoundException('Menu tidak ditemukan');
        if (!menu.isAvailable)
            throw new common_1.BadRequestException(`Menu "${menu.name}" sedang tidak tersedia`);
        let cart = await this.getPendingCart(session.id);
        if (!cart) {
            cart = await this.prisma.order.create({
                data: { sessionId: session.id, totalAmount: 0, status: client_1.OrderStatus.PENDING },
                include: { orderItems: { include: { menu: true } } },
            });
        }
        const existingItem = await this.prisma.orderItem.findFirst({
            where: { orderId: cart.id, menuId: dto.menuId },
        });
        if (existingItem) {
            await this.prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { qty: existingItem.qty + dto.qty, note: dto.note ?? existingItem.note },
            });
        }
        else {
            await this.prisma.orderItem.create({
                data: { orderId: cart.id, menuId: dto.menuId, qty: dto.qty, price: menu.price, note: dto.note },
            });
        }
        await this.recalcTotal(cart.id);
        return this.getPendingCart(session.id);
    }
    async updateCartItem(sessionToken, itemId, dto) {
        const session = await this.getActiveSession(sessionToken);
        const cart = await this.getPendingCart(session.id);
        if (!cart)
            throw new common_1.NotFoundException('Keranjang kosong');
        const item = cart.orderItems.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item tidak ditemukan di keranjang');
        if (dto.qty === 0) {
            await this.prisma.orderItem.delete({ where: { id: itemId } });
        }
        else {
            await this.prisma.orderItem.update({
                where: { id: itemId },
                data: { qty: dto.qty, ...(dto.note !== undefined && { note: dto.note }) },
            });
        }
        await this.recalcTotal(cart.id);
        return this.getPendingCart(session.id);
    }
    async removeCartItem(sessionToken, itemId) {
        const session = await this.getActiveSession(sessionToken);
        const cart = await this.getPendingCart(session.id);
        if (!cart)
            throw new common_1.NotFoundException('Keranjang kosong');
        const item = cart.orderItems.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Item tidak ditemukan di keranjang');
        await this.prisma.orderItem.delete({ where: { id: itemId } });
        await this.recalcTotal(cart.id);
        return this.getPendingCart(session.id);
    }
    async submitOrder(sessionToken) {
        const session = await this.getActiveSession(sessionToken);
        const cart = await this.getPendingCart(session.id);
        if (!cart)
            throw new common_1.BadRequestException('Keranjang kosong, tidak bisa submit');
        if (cart.orderItems.length === 0)
            throw new common_1.BadRequestException('Tambahkan item dulu sebelum order');
        let queueNumber = null;
        if (session.orderType === 'TAKEAWAY') {
            const lastQueue = await this.prisma.order.findFirst({
                where: { status: { not: client_1.OrderStatus.CANCELLED } },
                orderBy: { createdAt: 'desc' },
                select: { queueNumber: true },
            });
            queueNumber = (lastQueue?.queueNumber ?? 0) + 1;
        }
        const order = await this.prisma.order.update({
            where: { id: cart.id },
            data: { status: client_1.OrderStatus.CONFIRMED, ...(queueNumber && { queueNumber }) },
            include: {
                orderItems: { include: { menu: true } },
                session: { select: { orderType: true, customerName: true, table: true } },
            },
        });
        this.gateway.emitNewOrder(order);
        return order;
    }
    async getOrderById(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: { include: { menu: true } },
                session: { select: { orderType: true, customerName: true, table: true, token: true } },
                payment: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order tidak ditemukan');
        return order;
    }
    async getOrdersBySession(sessionToken) {
        const session = await this.getActiveSession(sessionToken);
        return this.prisma.order.findMany({
            where: { sessionId: session.id, status: { not: client_1.OrderStatus.PENDING } },
            include: { orderItems: { include: { menu: true } }, payment: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getKitchenQueue() {
        return this.prisma.order.findMany({
            where: { status: { in: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.PREPARING] } },
            include: {
                orderItems: { include: { menu: { select: { name: true } } } },
                session: { select: { orderType: true, customerName: true, table: { select: { number: true } } } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async updateOrderStatus(orderId, dto) {
        const order = await this.getOrderById(orderId);
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: dto.status },
            include: {
                orderItems: { include: { menu: true } },
                session: { select: { orderType: true, customerName: true, table: true, token: true } },
            },
        });
        this.gateway.emitOrderStatusUpdate(updated, updated.session?.token);
        if (updated.status === client_1.OrderStatus.READY && updated.session.orderType === 'TAKEAWAY') {
            this.gateway.emitQueueCalled(updated.queueNumber, updated.session.token);
        }
        return updated;
    }
    async getAllOrders(status) {
        return this.prisma.order.findMany({
            where: { ...(status && { status }) },
            include: {
                orderItems: { include: { menu: true } },
                session: { select: { orderType: true, customerName: true, table: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        order_gateway_1.OrderGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map