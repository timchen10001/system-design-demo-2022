import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { ImageType } from './enum/image-type.enum';
import { ImageFileService } from './image-file.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly imageFileService: ImageFileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFile(
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: ImageType,
  ) {
    try {
      file = this.imageFileService.examinateImage(file);

      await this.imageFileService.uploadFile(file).then(async (imageId) => {
        console.log({ imageId });
        await this.imageFileService.createImage(imageId, imageType);
        res.send({
          id: imageId,
          originname: file.originalname,
          url: join(this.configService.get('STATIC_FILE_HOST'), imageId),
        });
      });
    } catch (ex) {
      throw ex;
    }
  }
}
