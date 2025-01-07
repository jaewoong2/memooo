import { Basic } from 'src/core/entities/basic.entitiy';
import { Entity, Column } from 'typeorm';

export enum Status {
  NULL = 'NULL',
  QUEUE = 'QUEUE',
  DONE = 'DONE',
}

@Entity()
export class OpenAIResponse extends Basic {
  @Column({ type: 'text' })
  category: string;

  @Column({ type: 'text' })
  contents: string;

  @Column({ type: 'enum', name: 'status', enum: Status, default: Status.NULL })
  status: string;

  @Column({ type: 'text', primary: true })
  key: string;
}
