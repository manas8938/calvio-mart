// backend/mart-backend/src/main.ts - COMPLETE FIX

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ====================
  // CORS - CRITICAL FOR IMAGE LOADING
  // ====================
  app.enableCors({
    origin: '*', // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Disposition'],
  });

  // ====================
  // CRITICAL: Static file serving for uploaded images
  // ====================
  const possiblePaths = [
    join(__dirname, '..', 'uploads'),
    join(__dirname, '..', '..', 'uploads'),
    join(process.cwd(), 'uploads'),
  ];
  
  let uploadsPath = possiblePaths[0];
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      uploadsPath = path;
      break;
    }
  }
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsPath);
  }
  
  console.log('='.repeat(60));
  console.log('📂 Uploads directory:', uploadsPath);
  console.log('='.repeat(60));
  
  // PRIORITY 1: Express static middleware with CORS headers
  app.use('/uploads', express.static(uploadsPath, {
    setHeaders: (res, path) => {
      // Set CORS headers for images
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Cache-Control', 'public, max-age=31536000');
      
      // Set correct content type
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.set('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.png')) {
        res.set('Content-Type', 'image/png');
      } else if (path.endsWith('.webp')) {
        res.set('Content-Type', 'image/webp');
      } else if (path.endsWith('.gif')) {
        res.set('Content-Type', 'image/gif');
      }
    },
    fallthrough: false, // Return 404 if file not found
  }));

  // ====================
  // Global validation
  // ====================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ====================
  // Swagger API Documentation
  // ====================
  const config = new DocumentBuilder()
    .setTitle('Calvio Mart API')
    .setDescription('Complete E-Commerce API with Image Upload Support')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  const appUrl = `http://localhost:${port}`;
  
  console.log('='.repeat(60));
  console.log(`🚀 Application running on: ${appUrl}`);
  console.log(`📚 Swagger docs: ${appUrl}/api`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
  console.log(`🖼️  Images available at: ${appUrl}/uploads/`);
  console.log(`✅ CORS enabled for: *`);
  console.log('='.repeat(60));
  
  // List existing images
  try {
    const files = fs.readdirSync(uploadsPath);
    const imageFiles = files.filter(f => 
      !f.startsWith('.') && 
      (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.gif'))
    );
    console.log(`📸 ${imageFiles.length} images found in uploads directory:`);
    if (imageFiles.length > 0) {
      imageFiles.slice(0, 10).forEach(file => {
        console.log(`   ✅ ${appUrl}/uploads/${file}`);
      });
      if (imageFiles.length > 10) {
        console.log(`   ... and ${imageFiles.length - 10} more`);
      }
    }
  } catch (err) {
    console.warn('⚠️  Could not read uploads directory:', err.message);
  }
  
  console.log('='.repeat(60));
}

bootstrap();