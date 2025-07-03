import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { UploadModule } from './upload/upload.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [UploadModule, FileModule],
  controllers: [HealthController],
})
export class AppModule {}

