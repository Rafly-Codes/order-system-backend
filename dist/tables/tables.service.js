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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
let TablesService = class TablesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTable(dto) {
        const existing = await this.prisma.table.findUnique({
            where: { number: dto.number },
        });
        if (existing)
            throw new common_1.ConflictException(`Meja nomor ${dto.number} sudah ada`);
        const qrCode = (0, crypto_1.randomUUID)();
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
    async findOneTable(id) {
        const table = await this.prisma.table.findUnique({
            where: { id },
            include: {
                sessions: {
                    where: { isActive: true },
                    include: { orders: true },
                },
            },
        });
        if (!table)
            throw new common_1.NotFoundException('Meja tidak ditemukan');
        return table;
    }
    async updateTableStatus(id, dto) {
        await this.findOneTable(id);
        return this.prisma.table.update({
            where: { id },
            data: { status: dto.status },
        });
    }
    async deleteTable(id) {
        await this.findOneTable(id);
        return this.prisma.table.delete({ where: { id } });
    }
    async startSessionByQr(qrCode) {
        const table = await this.prisma.table.findUnique({ where: { qrCode } });
        if (!table)
            throw new common_1.NotFoundException('QR code tidak valid');
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
        const sessionToken = (0, crypto_1.randomUUID)();
        const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 3);
        const session = await this.prisma.session.create({
            data: {
                tableId: table.id,
                orderType: client_1.OrderType.DINE_IN,
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
    async startTakeawaySession(customerName) {
        if (!customerName?.trim()) {
            throw new common_1.BadRequestException('Nama pemesan tidak boleh kosong');
        }
        const sessionToken = (0, crypto_1.randomUUID)();
        const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
        const session = await this.prisma.session.create({
            data: {
                orderType: client_1.OrderType.TAKEAWAY,
                customerName: customerName.trim(),
                token: sessionToken,
                expiredAt,
            },
        });
        return { session };
    }
    async getSessionByToken(token) {
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
        if (!session)
            throw new common_1.NotFoundException('Sesi tidak ditemukan');
        if (!session.isActive)
            throw new common_1.BadRequestException('Sesi sudah tidak aktif');
        if (new Date() > session.expiredAt) {
            await this.prisma.session.update({
                where: { token },
                data: { isActive: false },
            });
            throw new common_1.BadRequestException('Sesi sudah expired, silakan scan ulang');
        }
        return session;
    }
    async endSession(token) {
        const session = await this.getSessionByToken(token);
        if (session.tableId) {
            await this.prisma.table.update({
                where: { id: session.tableId },
                data: { status: 'KOTOR' },
            });
        }
        return this.prisma.session.update({
            where: { token },
            data: { isActive: false },
        });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map