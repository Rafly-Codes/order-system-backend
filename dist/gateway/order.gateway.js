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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let OrderGateway = class OrderGateway {
    constructor() {
        this.logger = new common_1.Logger('OrderGateway');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoinSession(sessionToken, client) {
        client.join(`session:${sessionToken}`);
        this.logger.log(`Client ${client.id} joined session:${sessionToken}`);
        return { event: 'joined', room: `session:${sessionToken}` };
    }
    handleJoinKitchen(client) {
        client.join('kitchen');
        this.logger.log(`Client ${client.id} joined kitchen`);
        return { event: 'joined', room: 'kitchen' };
    }
    handleJoinKasir(client) {
        client.join('kasir');
        this.logger.log(`Client ${client.id} joined kasir`);
        return { event: 'joined', room: 'kasir' };
    }
    emitNewOrder(order) {
        this.server.to('kitchen').emit('order.new', {
            orderId: order.id,
            queueNumber: order.queueNumber,
            orderType: order.session?.orderType,
            customerName: order.session?.customerName,
            tableNumber: order.session?.table?.number,
            items: order.orderItems?.map((i) => ({
                name: i.menu?.name,
                qty: i.qty,
                note: i.note,
            })),
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
        });
    }
    emitOrderStatusUpdate(order, sessionToken) {
        const payload = {
            orderId: order.id,
            status: order.status,
            queueNumber: order.queueNumber,
            updatedAt: new Date(),
        };
        if (sessionToken) {
            this.server.to(`session:${sessionToken}`).emit('order.status_updated', payload);
        }
        this.server.to('kasir').emit('order.status_updated', payload);
        this.server.to('kitchen').emit('order.status_updated', payload);
    }
    emitPaymentConfirmed(orderId, sessionToken) {
        const payload = { orderId, status: 'PAID', paidAt: new Date() };
        if (sessionToken) {
            this.server.to(`session:${sessionToken}`).emit('payment.confirmed', payload);
        }
        this.server.to('kasir').emit('payment.confirmed', payload);
    }
    emitQueueCalled(queueNumber, sessionToken) {
        this.server.to(`session:${sessionToken}`).emit('queue.called', {
            queueNumber,
            message: `Nomor antrian ${queueNumber} silakan ambil pesanan di counter`,
        });
        this.server.to('kasir').emit('queue.called', { queueNumber });
    }
};
exports.OrderGateway = OrderGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrderGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:session'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrderGateway.prototype, "handleJoinSession", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:kitchen'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrderGateway.prototype, "handleJoinKitchen", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:kasir'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrderGateway.prototype, "handleJoinKasir", null);
exports.OrderGateway = OrderGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
    })
], OrderGateway);
//# sourceMappingURL=order.gateway.js.map