import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

export enum ActionEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

@Entity()
export class Action extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Index('action_type_idx')
  @Column({ type: 'enum', enum: ActionEnum })
  actionType: ActionEnum;

  static async findByCurrentActionAndUpdate(message: Message) {
    return this.createQueryBuilder()
      .update(Action)
      .set({ message: message.uuid })
      .where({ id: message.latestAction.id })
      .execute();
  }
}
