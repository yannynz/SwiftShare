import { Module } from '@nestjs/common';
import { FileController } from './file.controller.js';
import { FileService } from './file.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, RedisService],
})
export class FileModule {}

