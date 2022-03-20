import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { ActionEnum } from 'src/entities/action.entity';
import { MessageBatch } from 'src/entities/message-batch.entity';
import { Message } from 'src/entities/message.entity';
import { MessageBatchService } from 'src/message-batch/message-batch.service';
import {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  Repository,
  Connection,
  RemoveEvent,
} from 'typeorm';

const batchTypes = ['author', 'message', 'likes'];

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
    const action = await this.actionService.create(ActionEnum.Create);
    message.createActionId = action.id;
    message.latestAction = action;
  }

  async beforeUpdate(event: UpdateEvent<Message>): Promise<void> {
    const message = event.entity;
    const { createActionId } = message;
    const action = await this.actionService.create(
      ActionEnum.Update,
      createActionId,
    );
    message.latestAction = action;

    const actionId = action.id;
    const oldMessage = event.databaseEntity;
    const { updatedColumns } = event;
    updatedColumns
      .map((obj) => {
        return obj.propertyName;
      })
      .filter((col) => oldMessage[col].toString() !== message[col].toString())
      .forEach((col) => {
        const dto = {
          batchType: col,
          actionId,
          messageCreateActionId: createActionId,
          updatedValue: message[col],
        };
        this.messageBatchService.create(dto);
      });
  }

  beforeRemove(event: RemoveEvent<Message>): void {
    const message = event.entity;
    const { createActionId } = message;
    this.actionService.create(ActionEnum.Delete, createActionId);
    batchTypes.forEach((bt) => {
      this.messageBatchService.updateLatest(bt, createActionId);
    });
    return;
  }
}
