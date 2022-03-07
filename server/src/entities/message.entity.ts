import {
  AfterInsert,
  AfterUpdate,
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

@Entity()
export class Message {
  @PrimaryColumn('char', { length: 36 })
  uuid: string;

  @Column('varchar', { length: 64 })
  author: string;

  @Column('varchar', { length: 1024 })
  message: string;

  @Column()
  like: number;

  @Index('create_action_id_idx')
  @Column()
  createActionId: number;

  @Index('latest_action_id_idx')
  @OneToOne(() => Action)
  @JoinColumn()
  latestAction: Action;

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
  }
}
