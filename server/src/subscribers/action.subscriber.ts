import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Action, ActionEnum } from 'src/entities/action.entity';
import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';

@Injectable()
export class ActionSubscriber implements EntitySubscriberInterface<Action> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo(): Function {
    return Action;
  }

  beforeInsert(event: InsertEvent<Action>): void | Promise<any> {
    const action = event.entity;
    const { actionType } = action;
    if (actionType === ActionEnum.Update) {
    }
  }
}
