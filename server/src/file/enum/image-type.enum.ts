import { registerEnumType } from '@nestjs/graphql';

export enum ImageType {
  ARTICLE_IMAGE = 'ARTICLE_IMAGE',
  CAROUSEL_IMAGE = 'CAROUSEL_IMAGE',
  ARTIBOX_IMAGE = 'ARTIBOX_IMAGE',
}
registerEnumType(ImageType, { name: 'ImageType' });
