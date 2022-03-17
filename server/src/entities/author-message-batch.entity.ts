import { Column, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class AuthorMessageBatch extends MessageBatch {
  @Column('varchar', { nullable: true, length: 64 })
  updatedValue: string;
}
