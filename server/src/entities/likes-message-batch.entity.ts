import { Column, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class LikesMessageBatch extends MessageBatch {
  @Column({ nullable: true })
  updatedValue: number;
}
