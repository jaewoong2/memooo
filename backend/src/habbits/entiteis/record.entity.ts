import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Basic } from 'src/core/entities/basic.entitiy';
import { Habbit } from './habbit.entity';

@Entity('records')
export class Record extends Basic {
  @Column({ type: 'text' })
  imageUrl: string;

  @ManyToOne(() => Habbit, (habbit) => habbit.records, { onDelete: 'CASCADE' })
  @JoinColumn()
  habbit: Habbit; // 습관과 연결

  @Column({ type: 'timestamp with time zone', nullable: true })
  date: Date;

  @Column({ type: 'int', nullable: true, default: 50 })
  percentage: number;
}
