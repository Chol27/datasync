import { BeforeInsert, Entity } from 'typeorm';
import { MessageBatch } from './message-batch.entity';

@Entity()
export class LikesMessageBatch extends MessageBatch {
  updatedValue: number;

  @BeforeInsert()
  async deLatest() {
    const oldBatch = await LikesMessageBatch.findOne({ isLatest: true });
    if (oldBatch) {
      LikesMessageBatch.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
