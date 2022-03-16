import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

export enum UpdatedColumnEnum {
  Author = 'author',
  Message = 'message',
  Likes = 'likes',
}

@Entity()
export class MessageBatch extends BaseEntity {
  @PrimaryColumn()
  actionId: number;

  @Column()
  messageCreateActionId: number;

  @Column({ default: true })
  isLatest?: boolean;
}
