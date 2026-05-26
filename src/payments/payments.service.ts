import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { OrderGateway } from '../gateway/order.gateway';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrderGateway,
  ) {}

  // ── CHECKOUT: buat record payment ────────────────────────────

  async checkout(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { menu: true } },
        session: { select: { orderType: true, customerName: true, token: true, table: { select: { number: true } } } },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');
    if (order.status === OrderStatus.CANCELLED) throw new BadRequestException('Order sudah dibatalkan');
    if (order.payment?.status === PaymentStatus.PAID) throw new BadRequestException('Order sudah dibayar');

    // Untuk dine-in: harus sudah SERVED dulu
    if (
      order.session.orderType === 'DINE_IN' &&
      order.status !== OrderStatus.SERVED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      throw new BadRequestException('Pesanan dine-in harus sudah disajikan sebelum bayar');
    }

    // Buat atau ambil record payment
    const payment = await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        midtransOrderId: `ORDER-${Date.now()}`,
        amount: order.totalAmount,
        status: PaymentStatus.PENDING,
      },
      update: { status: PaymentStatus.PENDING },
    });

    // Ambil QRIS setting
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

  // ── KONFIRMASI BAYAR (kasir) ──────────────────────────────────

  async confirmPayment(paymentId: string, method: 'TUNAI' | 'QRIS') {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: { include: { session: true } } },
    });

    if (!payment) throw new NotFoundException('Payment tidak ditemukan');
    if (payment.status === PaymentStatus.PAID) throw new BadRequestException('Sudah dikonfirmasi sebelumnya');

    // Update payment → PAID
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.PAID, paidAt: new Date() },
    });

    // Update order → COMPLETED
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    // Kalau dine-in → meja jadi KOTOR, sesi nonaktif
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

    // Emit Socket.IO
    this.gateway.emitPaymentConfirmed(payment.orderId, payment.order.session.token);

    return { message: 'Pembayaran berhasil dikonfirmasi', method, paidAt: new Date() };
  }

  // ── BATALKAN PAYMENT ─────────────────────────────────────────

  async cancelPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment tidak ditemukan');
    if (payment.status === PaymentStatus.PAID) throw new BadRequestException('Tidak bisa batalkan payment yang sudah lunas');

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED },
    });
  }

  // ── GET STATUS PAYMENT ────────────────────────────────────────

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: { select: { status: true, totalAmount: true } } },
    });
    if (!payment) throw new NotFoundException('Payment tidak ditemukan');
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

  // ── UPLOAD / UPDATE QRIS ──────────────────────────────────────
  // QRIS disimpan sebagai env variable QRIS_IMAGE_URL
  // Admin tinggal update env dengan URL gambar QRIS

  getQrisInfo() {
    return {
      qrisImageUrl: process.env.QRIS_IMAGE_URL ?? null,
      message: process.env.QRIS_IMAGE_URL
        ? 'QRIS aktif'
        : 'QRIS belum disetup. Tambahkan QRIS_IMAGE_URL di .env',
    };
  }
}
