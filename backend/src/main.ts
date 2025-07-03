import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UploadService } from './upload/upload.service';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();

  const server = app.getHttpAdapter().getInstance() as express.Express;

  const uploadService = app.get(UploadService); 

  server.all(/^\/upload\/files(?:\/.*)?$/, (req, res) => uploadService.tus.handle(req, res));
  // (opcional: só se precisar dessas rotas)
  // server.use(express.json());
  // server.use(express.urlencoded({ extended: true }));

  process.env.KAFKA_ENABLED !== 'true' && console.warn('Kafka disabled');

  await app.listen(3000);
  console.log('🚀 Backend rodando em http://0.0.0.0:3000');
}

bootstrap();

