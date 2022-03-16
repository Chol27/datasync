import { BeforeInsert, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class AuthorMessageBatch extends MessageBatch {
  updatedValue: string;

  @BeforeInsert()
  async deLatest() {
    const oldBatch = await AuthorMessageBatch.findOne({ isLatest: true });
    if (oldBatch) {
      AuthorMessageBatch.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
