import { Entity } from 'typeorm';
import { MessageBatch } from './messageBatch.entity';

@Entity()
export class AuthorMessageBatch extends MessageBatch {
  updatedValue: string;
}
