import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import mongoose from 'mongoose';

async function bootstrap() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smallweb');
  console.log('✓ mongo connected');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
