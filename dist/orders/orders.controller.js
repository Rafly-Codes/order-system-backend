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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const add_cart_item_dto_1 = require("./dto/add-cart-item.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
function getSessionToken(headers) {
    const token = headers['x-session-token'];
    if (!token)
        throw new Error('Header X-Session-Token wajib diisi');
    return token;
}
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getCart(headers) {
        return this.ordersService.getCart(getSessionToken(headers));
    }
    addCartItem(headers, dto) {
        return this.ordersService.addCartItem(getSessionToken(headers), dto);
    }
    updateCartItem(headers, id, dto) {
        return this.ordersService.updateCartItem(getSessionToken(headers), id, dto);
    }
    removeCartItem(headers, id) {
        return this.ordersService.removeCartItem(getSessionToken(headers), id);
    }
    submitOrder(headers) {
        return this.ordersService.submitOrder(getSessionToken(headers));
    }
    getMyOrders(headers) {
        return this.ordersService.getOrdersBySession(getSessionToken(headers));
    }
    getOrderById(id) {
        return this.ordersService.getOrderById(id);
    }
    getKitchenQueue() {
        return this.ordersService.getKitchenQueue();
    }
    updateOrderStatus(id, dto) {
        return this.ordersService.updateOrderStatus(id, dto);
    }
    getAllOrders(status) {
        return this.ordersService.getAllOrders(status);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)('cart'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart/items'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_item_dto_1.AddCartItemDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "addCartItem", null);
__decorate([
    (0, common_1.Patch)('cart/items/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('cart/items/:id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "removeCartItem", null);
__decorate([
    (0, common_1.Post)('orders/submit'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "submitOrder", null);
__decorate([
    (0, common_1.Get)('orders/my'),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Get)('kitchen/queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getKitchenQueue", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'KASIR'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrders", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map