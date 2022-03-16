import { BeforeInsert, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class LikesMessageBatch extends MessageBatch {
  updatedValue: number;

  @BeforeInsert()
  async deLatest() {
    const { messageCreateActionId } = this;
    const oldBatch = await LikesMessageBatch.findOne({
      isLatest: true,
      messageCreateActionId,
    });
    if (oldBatch) {
      LikesMessageBatch.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
