import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';
import { OrderStatus } from '@prisma/client';
import { OrderGateway } from '../gateway/order.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrderGateway,
  ) {}

  // ── HELPER ───────────────────────────────────────────────────

  private async getActiveSession(sessionToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { token: sessionToken },
    });
    if (!session) throw new NotFoundException('Sesi tidak ditemukan');
    if (!session.isActive) throw new BadRequestException('Sesi sudah tidak aktif');
    if (new Date() > session.expiredAt) throw new BadRequestException('Sesi sudah expired');
    return session;
  }

  private async getPendingCart(sessionId: string) {
    return this.prisma.order.findFirst({
      where: { sessionId, status: OrderStatus.PENDING },
      include: {
        orderItems: {
          include: { menu: { select: { id: true, name: true, price: true, isAvailable: true } } },
        },
      },
    });
  }

  private async recalcTotal(orderId: string) {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return this.prisma.order.update({ where: { id: orderId }, data: { totalAmount: total } });
  }

  // ── KERANJANG ────────────────────────────────────────────────

  async getCart(sessionToken: string) {
    const session = await this.getActiveSession(sessionToken);
    const cart = await this.getPendingCart(session.id);
    if (!cart) return { items: [], totalAmount: 0, message: 'Keranjang kosong' };
    return cart;
  }

  async addCartItem(sessionToken: string, dto: AddCartItemDto) {
    const session = await this.getActiveSession(sessionToken);

    const menu = await this.prisma.menu.findUnique({ where: { id: dto.menuId } });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    if (!menu.isAvailable) throw new BadRequestException(`Menu "${menu.name}" sedang tidak tersedia`);

    let cart = await this.getPendingCart(session.id);
    if (!cart) {
      cart = await this.prisma.order.create({
        data: { sessionId: session.id, totalAmount: 0, status: OrderStatus.PENDING },
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
    } else {
      await this.prisma.orderItem.create({
        data: { orderId: cart.id, menuId: dto.menuId, qty: dto.qty, price: menu.price, note: dto.note },
      });
    }

    await this.recalcTotal(cart.id);
    return this.getPendingCart(session.id);
  }

  async updateCartItem(sessionToken: string, itemId: string, dto: UpdateCartItemDto) {
    const session = await this.getActiveSession(sessionToken);
    const cart = await this.getPendingCart(session.id);
    if (!cart) throw new NotFoundException('Keranjang kosong');

    const item = cart.orderItems.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item tidak ditemukan di keranjang');

    if (dto.qty === 0) {
      await this.prisma.orderItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.orderItem.update({
        where: { id: itemId },
        data: { qty: dto.qty, ...(dto.note !== undefined && { note: dto.note }) },
      });
    }

    await this.recalcTotal(cart.id);
    return this.getPendingCart(session.id);
  }

  async removeCartItem(sessionToken: string, itemId: string) {
    const session = await this.getActiveSession(sessionToken);
    const cart = await this.getPendingCart(session.id);
    if (!cart) throw new NotFoundException('Keranjang kosong');

    const item = cart.orderItems.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Item tidak ditemukan di keranjang');

    await this.prisma.orderItem.delete({ where: { id: itemId } });
    await this.recalcTotal(cart.id);
    return this.getPendingCart(session.id);
  }

  // ── ORDER ────────────────────────────────────────────────────

  async submitOrder(sessionToken: string) {
    const session = await this.getActiveSession(sessionToken);
    const cart = await this.getPendingCart(session.id);

    if (!cart) throw new BadRequestException('Keranjang kosong, tidak bisa submit');
    if (cart.orderItems.length === 0) throw new BadRequestException('Tambahkan item dulu sebelum order');

    let queueNumber: number | null = null;
    if (session.orderType === 'TAKEAWAY') {
      const lastQueue = await this.prisma.order.findFirst({
        where: { status: { not: OrderStatus.CANCELLED } },
        orderBy: { createdAt: 'desc' },
        select: { queueNumber: true },
      });
      queueNumber = (lastQueue?.queueNumber ?? 0) + 1;
    }

    const order = await this.prisma.order.update({
      where: { id: cart.id },
      data: { status: OrderStatus.CONFIRMED, ...(queueNumber && { queueNumber }) },
      include: {
        orderItems: { include: { menu: true } },
        session: { select: { orderType: true, customerName: true, table: true } },
      },
    });

    // Emit ke dapur via Socket.IO
    this.gateway.emitNewOrder(order);

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { menu: true } },
        session: { select: { orderType: true, customerName: true, table: true, token: true } },
        payment: true,
      },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    return order;
  }

  async getOrdersBySession(sessionToken: string) {
    const session = await this.getActiveSession(sessionToken);
    return this.prisma.order.findMany({
      where: { sessionId: session.id, status: { not: OrderStatus.PENDING } },
      include: { orderItems: { include: { menu: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── DAPUR ────────────────────────────────────────────────────

  async getKitchenQueue() {
    return this.prisma.order.findMany({
      where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING] } },
      include: {
        orderItems: { include: { menu: { select: { name: true } } } },
        session: { select: { orderType: true, customerName: true, table: { select: { number: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.getOrderById(orderId);

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
      include: {
        orderItems: { include: { menu: true } },
        session: { select: { orderType: true, customerName: true, table: true, token: true } },
      },
    });

    // Emit status update via Socket.IO
    this.gateway.emitOrderStatusUpdate(updated, (updated.session as any)?.token);

    // Kalau takeaway & READY → emit queue called
    if (updated.status === OrderStatus.READY && updated.session.orderType === 'TAKEAWAY') {
      this.gateway.emitQueueCalled(
        updated.queueNumber!,
        (updated.session as any).token,
      );
    }

    return updated;
  }

  async getAllOrders(status?: OrderStatus) {
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
}
