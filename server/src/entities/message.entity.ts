import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Action, ActionEnum } from './action.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryColumn('char', { length: 36 })
  uuid: string;

  @Column('varchar', { length: 64 })
  author: string;

  @Column('varchar', { length: 1024 })
  message: string;

  @Column()
  like: number;

  @Index()
  @OneToOne(() => Action)
  @JoinColumn()
  latestAction?: Action;

  @BeforeInsert()
  async insertActionForCreate() {
    const action = await Action.save(
      Action.create({ actionType: ActionEnum.Create }),
    );
    this.latestAction = action;
  }

  @AfterInsert()
  async setCurrentActionForMessage() {
    await Action.findByCurrentActionAndUpdate(this);
  }
}
