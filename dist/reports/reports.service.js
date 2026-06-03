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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesReport(period = 'today') {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        const payments = await this.prisma.payment.findMany({
            where: {
                status: client_1.PaymentStatus.PAID,
                paidAt: { gte: startDate },
            },
            include: {
                order: {
                    include: {
                        session: { select: { orderType: true } },
                        orderItems: { include: { menu: { select: { name: true, categoryId: true } } } },
                    },
                },
            },
        });
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalOrders = payments.length;
        const dineInOrders = payments.filter((p) => p.order.session.orderType === 'DINE_IN').length;
        const takeawayOrders = payments.filter((p) => p.order.session.orderType === 'TAKEAWAY').length;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
        return {
            period,
            startDate,
            endDate: now,
            summary: {
                totalRevenue,
                totalOrders,
                dineInOrders,
                takeawayOrders,
                avgOrderValue,
            },
        };
    }
    async getTopMenus(limit = 10, period = 'month') {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
        }
        const topMenus = await this.prisma.orderItem.groupBy({
            by: ['menuId'],
            where: {
                order: {
                    payment: { status: client_1.PaymentStatus.PAID, paidAt: { gte: startDate } },
                },
            },
            _sum: { qty: true },
            _count: { menuId: true },
            orderBy: { _sum: { qty: 'desc' } },
            take: limit,
        });
        const menuIds = topMenus.map((m) => m.menuId);
        const menus = await this.prisma.menu.findMany({
            where: { id: { in: menuIds } },
            include: { category: { select: { name: true } } },
        });
        return topMenus.map((item) => {
            const menu = menus.find((m) => m.id === item.menuId);
            return {
                menu,
                totalQty: item._sum.qty,
                totalOrders: item._count.menuId,
                totalRevenue: (item._sum.qty ?? 0) * (menu?.price ?? 0),
            };
        });
    }
    async getTableStats() {
        const tables = await this.prisma.table.findMany({
            include: {
                _count: { select: { sessions: true } },
                sessions: {
                    include: {
                        orders: {
                            where: { payment: { status: client_1.PaymentStatus.PAID } },
                            include: { payment: true },
                        },
                    },
                },
            },
            orderBy: { number: 'asc' },
        });
        return tables.map((table) => {
            const totalRevenue = table.sessions.flatMap((s) => s.orders).reduce((sum, o) => sum + (o.payment?.amount ?? 0), 0);
            return {
                id: table.id,
                number: table.number,
                capacity: table.capacity,
                status: table.status,
                totalSessions: table._count.sessions,
                totalRevenue,
            };
        });
    }
    async getDashboardSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todayRevenue, todayOrders, activeOrders, availableTables, totalMenus,] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { status: client_1.PaymentStatus.PAID, paidAt: { gte: today } },
                _sum: { amount: true },
            }),
            this.prisma.payment.count({
                where: { status: client_1.PaymentStatus.PAID, paidAt: { gte: today } },
            }),
            this.prisma.order.count({
                where: { status: { in: ['CONFIRMED', 'PREPARING', 'READY'] } },
            }),
            this.prisma.table.count({ where: { status: 'TERSEDIA' } }),
            this.prisma.menu.count({ where: { isAvailable: true } }),
        ]);
        return {
            today: {
                revenue: todayRevenue._sum.amount ?? 0,
                orders: todayOrders,
            },
            activeOrders,
            availableTables,
            totalMenus,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map