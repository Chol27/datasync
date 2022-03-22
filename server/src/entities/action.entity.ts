import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum ActionEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  messageCreateId: number;

  @Column({ type: 'enum', enum: ActionEnum })
  actionType: ActionEnum;
}
