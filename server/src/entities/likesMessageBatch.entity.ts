import { Entity } from 'typeorm';
import { MessageBatch } from './messageBatch.entity';

@Entity()
export class LikesMessageBatch extends MessageBatch {
  updatedValue: number;
}
