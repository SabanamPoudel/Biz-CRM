import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend is on port 3000
    credentials: true,
  });
  
  const port = process.env.PORT ?? 3001; // Backend runs on port 3001
  await app.listen(port);
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
}
bootstrap();
