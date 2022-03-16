import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Action, ActionEnum } from './action.entity';
import { AuthorMessageBatch } from './author-message-batch.entity';
import { LikesMessageBatch } from './likes-message-batch.entity';
import { TextMessageBatch } from './text-message-batch.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryColumn('char', { length: 36 })
  uuid: string;

  @Column('varchar', { length: 64 })
  author: string;

  @Column('varchar', { length: 1024 })
  message: string;

  @Column()
  likes: number;

  @Index('create_action_id_idx')
  @Column()
  createActionId: number;

  @Index('latest_action_id_idx')
  @OneToOne(() => Action)
  @JoinColumn()
  latestAction: Action;

  static findByCreateActionId(createActionId: number) {
    return this.createQueryBuilder()
      .orderBy('create_action_id')
      .where({ createActionId })
      .getOne();
  }

  @BeforeInsert()
  async insertActionForCreate() {
    const action = await Action.save(
      Action.create({ message: this.uuid, actionType: ActionEnum.Create }),
    );
    this.createActionId = action.id;
    this.latestAction = action;
  }

  @BeforeUpdate()
  async insertActionForUpdate() {
    const action = await Action.save(
      Action.create({ message: this.uuid, actionType: ActionEnum.Update }),
    );
    this.latestAction = action;

    const actionId = action.id;
    const { createActionId, author, message, likes } = this;

    const oldMessage = await Message.findByCreateActionId(createActionId);
    if (oldMessage.author !== author) {
      const authorBatch = AuthorMessageBatch.create({
        actionId,
        messageCreateActionId: createActionId,
        updatedValue: author,
      });
      AuthorMessageBatch.save(authorBatch);
    }

    if (oldMessage.message !== message) {
      const messageBatch = TextMessageBatch.create({
        actionId,
        messageCreateActionId: createActionId,
        updatedValue: message,
      });
      TextMessageBatch.save(messageBatch);
    }

    if (oldMessage.likes !== likes) {
      const likesBatch = LikesMessageBatch.create({
        actionId,
        messageCreateActionId: createActionId,
        updatedValue: likes,
      });
      LikesMessageBatch.save(likesBatch);
    }
  }
}
