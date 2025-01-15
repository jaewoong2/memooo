import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Basic } from 'src/core/entities/basic.entitiy';
import { User } from 'src/users/entities/user.entity';
import { Record } from './record.entity';

export enum Icon {
  Star = 'star',
  Smile = 'smile',
  Salad = 'salad',
  GlassWater = 'glassWater',
  Sun = 'sun',
  Moon = 'moon',
  None = 'none',
  Finance = 'finance',
  WorkOut = 'workout',
}

@Entity('habbits')
@Index('unique_title_user_not_deleted', ['title', 'user'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class Habbit extends Basic {
  @Column({ type: 'text' })
  title: string;

  @Column({
    type: 'enum',
    enum: Icon,
    default: Icon.Star,
  })
  icon: Icon;

  @Column({ type: 'text', default: 'default' })
  group: string;

  @ManyToOne(() => User, (user) => user.habbits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User; // 습관 소유자

  @OneToMany(() => Record, (record) => record.habbit, { cascade: true })
  records: Record[]; // 해당 습관의 기록들
}
