import {
  AfterInsert,
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Action } from './action.entity';

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

  @AfterInsert()
  async setCurrentActionForMessage() {
    console.log('enter');
    await Action.findByCurrentActionAndUpdate(this);
  }
}
