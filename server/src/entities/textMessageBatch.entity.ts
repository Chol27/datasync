import { Entity } from 'typeorm';
import { MessageBatch } from './messageBatch.entity';

@Entity()
export class TextMessageBatch extends MessageBatch {
  updatedValue: string;
}
