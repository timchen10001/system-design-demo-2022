import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { join } from 'path';
import { createHash } from 'crypto';

@Injectable()
export class FileService {
  private bucket: Bucket;

  constructor(configService: ConfigService) {
    const storage = new Storage({
      keyFilename: join(
        process.cwd(),
        configService.get('GOOGLE_APPLICATION_CREDENTIALS'),
      ),
    });

    this.bucket = storage.bucket(configService.get('GCLOUD_STORAGE_BUCKET'));
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const hash = createHash('sha1');
    hash.update(file.originalname + Date.now());

    const gcsFileName = `${hash.digest('hex')}`;
    const gcsFile = this.bucket.file(gcsFileName);

    const ws = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    ws.end(file.buffer);

    return new Promise((resolve, reject) => {
      ws.on('finish', () => resolve(gcsFileName));
      ws.on('error', reject);
    });
  }
}
