import { Column, Entity, Index } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class LikesMessageBatch extends MessageBatch {
  @Column({ nullable: true })
  updatedValue: number;

  @Index('likes_batch_idx')
  @Column({ default: true })
  isLatest?: boolean;
}
