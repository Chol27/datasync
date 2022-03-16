import { BeforeInsert, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class TextMessageBatch extends MessageBatch {
  updatedValue: string;

  @BeforeInsert()
  async deLatest() {
    const { messageCreateActionId } = this;
    const oldBatch = await TextMessageBatch.findOne({
      isLatest: true,
      messageCreateActionId,
    });
    if (oldBatch) {
      TextMessageBatch.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
