import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ImageEntity } from './entities/image.entity';
import { ImageRepository } from './image.repository';
import { ImageFileService } from './image-file.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), AuthModule, ConfigService],
  providers: [FileService, ImageFileService, ImageRepository],
  controllers: [FileController],
  exports: [FileService, ImageFileService],
})
export class FileModule {}
