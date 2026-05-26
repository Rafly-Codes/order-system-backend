import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'KASIR')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // GET /reports/dashboard — ringkasan dashboard
  @Get('dashboard')
  getDashboard() {
    return this.reportsService.getDashboardSummary();
  }

  // GET /reports/sales?period=today|week|month|year
  @Get('sales')
  getSales(@Query('period') period: 'today' | 'week' | 'month' | 'year' = 'today') {
    return this.reportsService.getSalesReport(period);
  }

  // GET /reports/top-menus?limit=10&period=month
  @Get('top-menus')
  getTopMenus(
    @Query('limit') limit?: string,
    @Query('period') period: 'today' | 'week' | 'month' = 'month',
  ) {
    return this.reportsService.getTopMenus(limit ? parseInt(limit) : 10, period);
  }

  // GET /reports/tables
  @Get('tables')
  getTableStats() {
    return this.reportsService.getTableStats();
  }
}
