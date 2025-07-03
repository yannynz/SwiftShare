import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { KafkaService }  from '../kafka/kafka.service.js';
import { RedisService }  from '../redis/redis.service.js';
import { Server as TusServer } from '@tus/server';
import { FileStore }           from '@tus/file-store';
import fs  from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

@Injectable()
export class UploadService {
  public tus: TusServer;
  private readonly genToken: () => string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka : KafkaService,
    private readonly redis : RedisService,
  ) {
    const dictFile = path.join(__dirname, 'dictionary.txt');
    const words = fs.readFileSync(dictFile, 'utf8').trim().split('\n');
    this.genToken = () =>
      Array.from({ length: 3 }, () =>
        words[Math.floor(Math.random() * words.length)]).join('-');

    const uploadDir = process.env.UPLOAD_DIR ?? '/data/uploads';
    fs.mkdirSync(uploadDir, { recursive: true });

    this.tus = new TusServer({
      path: '/upload/files',
      datastore: new FileStore({ directory: uploadDir })
    });

    this.tus.on('post-finish', async ({ file }) => {
  const token     = this.genToken();
  const expires   = Number(process.env.DEFAULT_EXPIRE_SEC ?? 60 * 60 * 24 * 7);
  const expiresAt = new Date(Date.now() + expires * 1000);

  const metadata: Record<string, string> = {};
  const rawMetadata = file.upload_metadata?.split(',') ?? [];

  for (const pair of rawMetadata) {
    const [key, value] = pair.split(' ');
    if (key && value) metadata[key] = Buffer.from(value, 'base64').toString('utf8');
  }

  await this.prisma.file.create({
    data: {
      token,
      tokenHash: token,
      size: file.size,
      expiresAt,
      filename: metadata['filename'] ?? null,  
    },
  });

  await this.redis.set(token, file.id, expires);
  await this.kafka.emit('file.uploaded', {
    fileId: file.id,
    token,
    size: file.size,
    filename: metadata['filename'],
  });
});

