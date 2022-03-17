import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { ActionEnum } from 'src/entities/action.entity';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { MessageBatch } from 'src/entities/message-batch.entity';
import { Message } from 'src/entities/message.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import { MessageBatchService } from 'src/message-batch/message-batch.service';
import {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  getRepository,
  Repository,
  Connection,
} from 'typeorm';

const batchMapper = {
  author: AuthorMessageBatch,
  message: TextMessageBatch,
  likes: LikesMessageBatch,
};

export async function updateLatest(
  repository: Repository<MessageBatch>,
  messageCreateActionId: number,
) {
  const oldBatch = await repository.findOne({
    isLatest: true,
    messageCreateActionId,
  });
  if (oldBatch) {
    repository.update(oldBatch.actionId, { isLatest: false });
  }
}

@Injectable()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
  constructor(
    @InjectConnection()
    connection: Connection,
    private readonly actionService: ActionService,
    private readonly messageBatchService: MessageBatchService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): Function {
    return Message;
  }

  async beforeInsert(event: InsertEvent<Message>): Promise<void> {
    const message = event.entity;
    const { uuid } = message;
    const action = await this.actionService.create(uuid, ActionEnum.Create);
    message.createActionId = action.id;
    message.latestAction = action;
  }

  async beforeUpdate(event: UpdateEvent<Message>): Promise<void> {
    const message = event.entity;
    const { uuid, createActionId } = message;
    const action = await this.actionService.create(uuid, ActionEnum.Update);
    message.latestAction = action;

    const actionId = action.id;
    const { updatedColumns } = event;
    updatedColumns
      .map((obj) => {
        return obj.propertyName;
      })
      .forEach(async (col) => {
        const dto = {
          batchType: col,
          actionId,
          messageCreateActionId: createActionId,
          updatedValue: message[col],
        };
        await this.messageBatchService.create(dto);
      });
  }
}
