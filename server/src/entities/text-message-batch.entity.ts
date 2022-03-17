import { Column, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class TextMessageBatch extends MessageBatch {
  @Column('varchar', { nullable: true, length: 1024 })
  updatedValue: string;
}
