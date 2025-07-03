import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service.js';

@Controller('/file')
export class UploadController {
  constructor(private readonly service: FileService); // <- nome precisa ser "service"

  @Get('/:token')
  getFileMetadata(@Param('token') token: string) {
    return this.service.getMetadata(token); // <- também usa "this.service"
  }
}

