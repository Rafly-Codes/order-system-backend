import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  // GET /tables — kasir & admin lihat semua meja + status
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tablesService.findAllTables();
  }

  // GET /tables/:id — detail meja + sesi aktif
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.findOneTable(id);
  }

  // POST /tables — admin buat meja baru + generate QR
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.createTable(dto);
  }

  // PATCH /tables/:id/status — kasir/admin ubah status meja
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTableStatusDto,
  ) {
    return this.tablesService.updateTableStatus(id, dto);
  }

  // DELETE /tables/:id — admin hapus meja
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tablesService.deleteTable(id);
  }

  // ── SESI ─────────────────────────────────────────────────────

  // GET /tables/qr/:qrCode — pelanggan scan QR → dapat session token
  @Get('qr/:qrCode')
  startSessionByQr(@Param('qrCode') qrCode: string) {
    return this.tablesService.startSessionByQr(qrCode);
  }

  // POST /tables/takeaway — pelanggan mulai sesi takeaway
  @Post('takeaway')
  startTakeaway(@Body('customerName') customerName: string) {
    return this.tablesService.startTakeawaySession(customerName);
  }

  // GET /tables/session/:token — cek sesi aktif via token
  @Get('session/:token')
  getSession(@Param('token') token: string) {
    return this.tablesService.getSessionByToken(token);
  }

  // PATCH /tables/session/:token/end — akhiri sesi
  @Patch('session/:token/end')
  @UseGuards(JwtAuthGuard)
  endSession(@Param('token') token: string) {
    return this.tablesService.endSession(token);
  }
}
