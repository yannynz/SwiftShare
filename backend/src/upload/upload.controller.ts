import { All, Controller, Req, Res } from '@nestjs/common';
import { UploadService }             from './upload.service.js';
import type { Request, Response }    from 'express';

@Controller('upload/files')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @All()
  async handle(@Req() req: Request, @Res() res: Response) {
    return this.uploadService.tus.handle(req, res);
  }
}

