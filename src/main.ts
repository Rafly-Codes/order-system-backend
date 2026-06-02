import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // REPAIR: Mengizinkan port 5173 dan port 3000 (Next.js)
  app.enableCors({ 
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
      process.env.FRONTEND_URL
    ].filter(Boolean), // .filter(Boolean) memastikan jika process.env.FRONTEND_URL kosong tidak akan error
    credentials: true 
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