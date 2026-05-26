import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

class ConfirmPaymentDto {
  @IsEnum(['TUNAI', 'QRIS'], { message: 'Method harus TUNAI atau QRIS' })
  method: 'TUNAI' | 'QRIS';
}

class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // POST /payments/checkout — buat tagihan
  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(dto.orderId);
  }

  // POST /payments/:id/confirm — kasir konfirmasi bayar
  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KASIR')
  @HttpCode(HttpStatus.OK)
  confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmPayment(id, dto.method);
  }

  // POST /payments/:id/cancel — kasir batalkan payment
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KASIR')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.cancelPayment(id);
  }

  // GET /payments/qris — info QRIS
  @Get('qris')
  getQris() {
    return this.paymentsService.getQrisInfo();
  }

  // GET /payments/history — riwayat transaksi
  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KASIR')
  getHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getPaymentHistory(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  // GET /payments/:orderId — status payment by order
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }
}
