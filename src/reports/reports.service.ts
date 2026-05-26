import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // ── PENJUALAN ─────────────────────────────────────────────────

  async getSalesReport(period: 'today' | 'week' | 'month' | 'year' = 'today') {
    const now = new Date();
    let startDate: Date;

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
        status: PaymentStatus.PAID,
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

  // ── MENU TERLARIS ─────────────────────────────────────────────

  async getTopMenus(limit = 10, period: 'today' | 'week' | 'month' = 'month') {
    const now = new Date();
    let startDate: Date;

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
          payment: { status: PaymentStatus.PAID, paidAt: { gte: startDate } },
        },
      },
      _sum: { qty: true },
      _count: { menuId: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: limit,
    });

    // Ambil detail menu
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

  // ── STATISTIK MEJA ────────────────────────────────────────────

  async getTableStats() {
    const tables = await this.prisma.table.findMany({
      include: {
        _count: { select: { sessions: true } },
        sessions: {
          include: {
            orders: {
              where: { payment: { status: PaymentStatus.PAID } },
              include: { payment: true },
            },
          },
        },
      },
      orderBy: { number: 'asc' },
    });

    return tables.map((table) => {
      const totalRevenue = table.sessions.flatMap((s) => s.orders).reduce(
        (sum, o) => sum + (o.payment?.amount ?? 0),
        0,
      );
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

  // ── DASHBOARD SUMMARY ─────────────────────────────────────────

  async getDashboardSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayRevenue,
      todayOrders,
      activeOrders,
      availableTables,
      totalMenus,
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID, paidAt: { gte: today } },
        _sum: { amount: true },
      }),
      this.prisma.payment.count({
        where: { status: PaymentStatus.PAID, paidAt: { gte: today } },
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
}
