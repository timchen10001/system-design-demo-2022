import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCode } from 'src/error/enum/error-code.enum';
import { InvalidInputException } from '../error';
import { ImageType } from './enum/image-type.enum';
import { FileService } from './file.service';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageFileService extends FileService {
  private ALLOWED_FILE_MAX_SIZE: number;
  private ALLOWED_FILE_MIMETYPES: Array<string> = ['image/png', 'image/jpeg'];

  constructor(
    private configService: ConfigService,
    private imageRepository: ImageRepository,
  ) {
    super(configService);
    this.ALLOWED_FILE_MAX_SIZE = this.configService.get('IMAGE_MAX_SIZE');
  }

  examinateImage(file: Express.Multer.File): Express.Multer.File {
    if (file.size > this.ALLOWED_FILE_MAX_SIZE) {
      throw new InvalidInputException(
        `File Size Too Large:${file.originalname}`,
        ErrorCode.BAD_FORMAT_FILE_SIZE,
      );
    }

    if (!this.ALLOWED_FILE_MIMETYPES.includes(file.mimetype)) {
      throw new InvalidInputException(
        `Unsupported MimeType:${file.mimetype}`,
        ErrorCode.BAD_FORMAT_FILE_MIMETYPE,
      );
    }

    return file;
  }

  createImage(id: string, type: ImageType) {
    return this.imageRepository.create(id, type);
  }

  findImage(id: string) {
    return this.imageRepository.findImageOrFailed(id);
  }
}
