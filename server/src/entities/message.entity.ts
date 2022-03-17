import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Action } from './action.entity';

@Entity()
export class Message {
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
}
