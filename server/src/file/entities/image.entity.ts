import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ImageType } from '../enum/image-type.enum';

@Entity('images')
export class ImageEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 50 })
  type: ImageType;
}
