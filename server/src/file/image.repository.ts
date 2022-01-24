import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '../error';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImageType } from './enum/image-type.enum';
import { ErrorCode } from '../error/enum/error-code.enum';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepo: Repository<ImageEntity>,
  ) {}

  create(id: string, type: ImageType) {
    const image = this.imageRepo.create({ id, type });
    return this.imageRepo.save(image);
  }

  async findImageOrFailed(id: string): Promise<ImageEntity> {
    try {
      return await this.imageRepo.findOneOrFail(id);
    } catch (ex) {
      throw new NotFoundException(
        `Image Id: ${id}`,
        ErrorCode.NOT_FOUND_IMAGE_ID,
      );
    }
  }
}
