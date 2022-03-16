import { BeforeInsert, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class AuthorMessageBatch extends MessageBatch {
  updatedValue: string;

  @BeforeInsert()
  async deLatest() {
    const { messageCreateActionId } = this;
    const oldBatch = await AuthorMessageBatch.findOne({
      isLatest: true,
      messageCreateActionId,
    });
    if (oldBatch) {
      AuthorMessageBatch.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
