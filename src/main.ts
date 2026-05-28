import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 1. Import ini

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true });

  // 2. Tambahkan Konfigurasi Swagger di bawah ini
  const config = new DocumentBuilder()
    .setTitle('Order System API')
    .setDescription('Dokumentasi API untuk Sistem Pemesanan')
    .setVersion('1.0')
    .addBearerAuth() // Jika pakai JWT auth
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Ini membuat Swagger bisa diakses di rute /api

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server jalan di http://localhost:${port}`);
}
bootstrap();