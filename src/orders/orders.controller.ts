import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderStatus } from '@prisma/client';

// Helper ambil session token dari header X-Session-Token
function getSessionToken(headers: Record<string, string>): string {
  const token = headers['x-session-token'];
  if (!token) {
    // Diubah agar tidak jadi Error 500, melainkan Error 400 (Bad Request)
    throw new BadRequestException('Header X-Session-Token wajib diisi');
  }
  return token;
}

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── KERANJANG ─────────────────────────────────────────────────

  // GET /cart — lihat isi keranjang
 @Get('cart')
getCart(@Headers() headers: Record<string, string>) {
  console.log("Request masuk ke /cart dengan header:", headers['x-session-token']);
  return this.ordersService.getCart(getSessionToken(headers));
}

  // POST /cart/items — tambah item ke keranjang
  @Post('cart/items')
  addCartItem(
    @Headers() headers: Record<string, string>,
    @Body() dto: AddCartItemDto,
  ) {
    return this.ordersService.addCartItem(getSessionToken(headers), dto);
  }

  // PATCH /cart/items/:id — update qty/catatan item
  @Patch('cart/items/:id')
  updateCartItem(
    @Headers() headers: Record<string, string>,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.ordersService.updateCartItem(getSessionToken(headers), id, dto);
  }

  // DELETE /cart/items/:id — hapus item dari keranjang
  @Delete('cart/items/:id')
  removeCartItem(
    @Headers() headers: Record<string, string>,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.removeCartItem(getSessionToken(headers), id);
  }

  // ── ORDER ─────────────────────────────────────────────────────

  // POST /orders — buat order langsung (DINE_IN / TAKEAWAY), JWT opsional
  @Post('orders')
  @UseGuards(OptionalJwtAuthGuard)
  createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.createOrder(dto, user?.id ?? null);
  }

  // GET /orders/me — semua order milik user yang login (JWT)
  @Get('orders/me')
  @UseGuards(JwtAuthGuard)
  getMyOrdersByUser(@CurrentUser('id') userId: string) {
    return this.ordersService.getOrdersByUser(userId);
  }

  // POST /orders/submit — submit dari keranjang sesi
  @Post('orders/submit')
  submitOrder(@Headers() headers: Record<string, string>) {
    return this.ordersService.submitOrder(getSessionToken(headers));
  }

  // GET /orders/my — semua order dalam sesi ini
  @Get('orders/my')
  getMyOrders(@Headers() headers: Record<string, string>) {
    return this.ordersService.getOrdersBySession(getSessionToken(headers));
  }

  // GET /orders/:id — detail order by ID
  @Get('orders/:id')
  getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderById(id);
  }

  // ── DAPUR ─────────────────────────────────────────────────────

  // GET /orders/kitchen — antrian order masuk dapur
  @Get('kitchen/queue')
  @UseGuards(JwtAuthGuard)
  getKitchenQueue() {
    return this.ordersService.getKitchenQueue();
  }

  // PATCH /orders/:id/status — dapur/kasir update status order
  @Patch('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  // ── ADMIN ─────────────────────────────────────────────────────

  // GET /orders — semua order, bisa filter ?status=CONFIRMED
  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'KASIR')
  getAllOrders(@Query('status') status?: OrderStatus) {
    return this.ordersService.getAllOrders(status);
  }
}