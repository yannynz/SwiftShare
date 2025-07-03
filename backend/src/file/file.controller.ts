import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from './file.service.js';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':token')
  async getByToken(@Param('token') token: string) {
    return this.fileService.getByToken(token);
  }

  @Patch(':token')
  async updateFile(
    @Param('token') token: string,
    @Body() body: { filename?: string; extendExpirationSec?: number },
  ) {
    const updated = await this.fileService.updateFile(token, body);
    if (!updated) throw new NotFoundException('Arquivo não encontrado');
    return updated;
  }
}

