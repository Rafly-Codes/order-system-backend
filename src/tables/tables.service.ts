import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { randomUUID } from 'crypto';
import { OrderType } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  // ── MEJA ─────────────────────────────────────────────────────

  async createTable(dto: CreateTableDto) {
    const existing = await this.prisma.table.findUnique({
      where: { number: dto.number },
    });
    if (existing) throw new ConflictException(`Meja nomor ${dto.number} sudah ada`);

    const qrCode = randomUUID();

    return this.prisma.table.create({
      data: { ...dto, qrCode },
    });
  }

  async findAllTables() {
    return this.prisma.table.findMany({
      orderBy: { number: 'asc' },
      include: {
        sessions: {
          where: { isActive: true },
          select: { id: true, createdAt: true, orderType: true },
        },
      },
    });
  }

  async findOneTable(id: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: {
        sessions: {
          where: { isActive: true },
          include: { orders: true },
        },
      },
    });
    if (!table) throw new NotFoundException('Meja tidak ditemukan');
    return table;
  }

  async updateTableStatus(id: string, dto: UpdateTableStatusDto) {
    await this.findOneTable(id);
    return this.prisma.table.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async deleteTable(id: string) {
    await this.findOneTable(id);
    return this.prisma.table.delete({ where: { id } });
  }

  // ── SESI QR ──────────────────────────────────────────────────

  async startSessionByQr(qrCode: string) {
    const table = await this.prisma.table.findUnique({ where: { qrCode } });
    if (!table) throw new NotFoundException('QR code tidak valid');

    if (table.status === 'TERISI') {
      const activeSession = await this.prisma.session.findFirst({
        where: { tableId: table.id, isActive: true },
        include: { orders: true },
      });
      if (activeSession) {
        return { table, session: activeSession, isNew: false };
      }
    }

    await this.prisma.session.updateMany({
      where: { tableId: table.id, isActive: true },
      data: { isActive: false },
    });

    const sessionToken = randomUUID();
    const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 3);

    const session = await this.prisma.session.create({
      data: {
        tableId: table.id,
        orderType: OrderType.DINE_IN,
        token: sessionToken,
        expiredAt,
      },
    });

    await this.prisma.table.update({
      where: { id: table.id },
      data: { status: 'TERISI' },
    });

    return { table, session, isNew: true };
  }

  async startTakeawaySession(customerName: string) {
    if (!customerName?.trim()) {
      throw new BadRequestException('Nama pemesan tidak boleh kosong');
    }

    const sessionToken = randomUUID();
    const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 2);

    const session = await this.prisma.session.create({
      data: {
        orderType: OrderType.TAKEAWAY,
        customerName: customerName.trim(),
        token: sessionToken,
        expiredAt,
      },
    });

    return { session };
  }

  async getSessionByToken(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: {
        table: true,
        orders: {
          include: { orderItems: { include: { menu: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!session) throw new NotFoundException('Sesi tidak ditemukan');
    if (!session.isActive) throw new BadRequestException('Sesi sudah tidak aktif');
    if (new Date() > session.expiredAt) {
      await this.prisma.session.update({
        where: { token },
        data: { isActive: false },
      });
      throw new BadRequestException('Sesi sudah expired, silakan scan ulang');
    }

    return session;
  }

  async endSession(token: string) {
    const session = await this.getSessionByToken(token);

    // Meja dikembalikan ke TERSEDIA karena 'KOTOR' sudah tidak ada
    if (session.tableId) {
      await this.prisma.table.update({
        where: { id: session.tableId },
        data: { status: 'TERSEDIA' },
      });
    }

    return this.prisma.session.update({
      where: { token },
      data: { isActive: false },
    });
  }
}