import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, KafkaService, RedisService],
})
export class UploadModule {}

