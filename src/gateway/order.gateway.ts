import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('OrderGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Pelanggan join room berdasarkan session token
  @SubscribeMessage('join:session')
  handleJoinSession(
    @MessageBody() sessionToken: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`session:${sessionToken}`);
    this.logger.log(`Client ${client.id} joined session:${sessionToken}`);
    return { event: 'joined', room: `session:${sessionToken}` };
  }

  // Dapur join room kitchen
  @SubscribeMessage('join:kitchen')
  handleJoinKitchen(@ConnectedSocket() client: Socket) {
    client.join('kitchen');
    this.logger.log(`Client ${client.id} joined kitchen`);
    return { event: 'joined', room: 'kitchen' };
  }

  // Kasir join room kasir
  @SubscribeMessage('join:kasir')
  handleJoinKasir(@ConnectedSocket() client: Socket) {
    client.join('kasir');
    this.logger.log(`Client ${client.id} joined kasir`);
    return { event: 'joined', room: 'kasir' };
  }

  // ── EMIT EVENTS (dipanggil dari service) ─────────────────────

  // Notifikasi ke dapur: ada order masuk baru
  emitNewOrder(order: any) {
    this.server.to('kitchen').emit('order.new', {
      orderId: order.id,
      queueNumber: order.queueNumber,
      orderType: order.session?.orderType,
      customerName: order.session?.customerName,
      tableNumber: order.session?.table?.number,
      items: order.orderItems?.map((i: any) => ({
        name: i.menu?.name,
        qty: i.qty,
        note: i.note,
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });
  }

  // Notifikasi update status order → ke pelanggan & kasir
  emitOrderStatusUpdate(order: any, sessionToken?: string) {
    const payload = {
      orderId: order.id,
      status: order.status,
      queueNumber: order.queueNumber,
      updatedAt: new Date(),
    };

    // Kirim ke room sesi pelanggan
    if (sessionToken) {
      this.server.to(`session:${sessionToken}`).emit('order.status_updated', payload);
    }

    // Kirim ke kasir & dapur juga
    this.server.to('kasir').emit('order.status_updated', payload);
    this.server.to('kitchen').emit('order.status_updated', payload);
  }

  // Notifikasi pembayaran berhasil → ke pelanggan & kasir
  emitPaymentConfirmed(orderId: string, sessionToken?: string) {
    const payload = { orderId, status: 'PAID', paidAt: new Date() };

    if (sessionToken) {
      this.server.to(`session:${sessionToken}`).emit('payment.confirmed', payload);
    }
    this.server.to('kasir').emit('payment.confirmed', payload);
  }

  // Notifikasi nomor antrian dipanggil → ke pelanggan takeaway
  emitQueueCalled(queueNumber: number, sessionToken: string) {
    this.server.to(`session:${sessionToken}`).emit('queue.called', {
      queueNumber,
      message: `Nomor antrian ${queueNumber} silakan ambil pesanan di counter`,
    });
    this.server.to('kasir').emit('queue.called', { queueNumber });
  }
}
