import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // REVISI: Konfigurasi CORS yang lebih kebal dan dinamis untuk development lokal
  app.enableCors({ 
    origin: true, // Akan otomatis mengizinkan origin yang me-request (sangat aman untuk fase dev lokal -> backend ter-deploy)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Session-Token, x-session-token',
    credentials: true,
  });

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('Order System API')
    .setDescription('Dokumentasi API untuk Sistem Pemesanan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server jalan di http://localhost:${port}`);
}
bootstrap();