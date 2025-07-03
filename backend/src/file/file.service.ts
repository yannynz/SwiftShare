import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async getByToken(token: string) {
    return this.prisma.file.findUnique({ where: { token } });
  }

  async updateFile(token: string, data: { filename?: string; extendExpirationSec?: number }) {
    const file = await this.prisma.file.findUnique({ where: { token } });
    if (!file) return null;

    const updates: any = {};
    if (data.filename) updates.filename = data.filename;

    if (data.extendExpirationSec) {
      updates.expiresAt = new Date(
        new Date(file.expiresAt).getTime() + data.extendExpirationSec * 1000,
      );
    }

    return this.prisma.file.update({
      where: { token },
      data: updates,
    });
  }
}

