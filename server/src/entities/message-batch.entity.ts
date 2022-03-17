import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

export enum UpdatedColumnEnum {
  Author = 'author',
  Message = 'message',
  Likes = 'likes',
}

@Entity()
export abstract class MessageBatch {
  @PrimaryColumn()
  actionId: number;

  @Column()
  messageCreateActionId: number;

  @Column({ default: true })
  isLatest?: boolean;
}
