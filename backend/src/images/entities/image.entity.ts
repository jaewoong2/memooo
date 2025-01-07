import { Entity, Column } from 'typeorm';
import { Basic } from 'src/core/entities/basic.entitiy';

@Entity('images')
export class Image extends Basic {
  @Column({ type: 'varchar', unique: false })
  imageUrl: string;

  @Column({ type: 'varchar', unique: false })
  name: string;
}
