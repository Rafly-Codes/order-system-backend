import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController() // Agar controller utama ini tidak ikut masuk ke daftar dokumen Swagger
@Controller()
export class AppController {
  @Get()
  @Redirect('/api', 302) // Mengalihkan halaman utama langsung ke rute Swagger (/api)
  getHello() {
    return { url: '/api' };
  }
}