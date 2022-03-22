import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, ActionEnum } from 'src/entities/action.entity';
import { getConnection, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  create(actionType: ActionEnum, messageCreateId?: number): Promise<Action> {
    const action = this.actionRepo.create({ messageCreateId, actionType });
    return this.actionRepo.save(action);
  }

  update(id: number, dto: Partial<Action>): Promise<UpdateResult> {
    return this.actionRepo.update(id, dto);
  }

  findDeleteTypeByLatestId(latestActionId: number): Promise<Action[]> {
    const orderedActionQuery = this.actionRepo
      .createQueryBuilder('action')
      .select('action.id, action.messageCreateId')
      .orderBy({
        'action.id': 'DESC',
        'action.messageCreateId': 'ASC',
      })
      .getQuery();
    // typeorm is incompatible with postgres?
    const query = `SELECT ob.message_create_id FROM (${orderedActionQuery})ob WHERE ob."id" > ${latestActionId} AND ob."message_create_id" <= ${latestActionId};`;
    return getConnection().query(query);
  }

  getLatestActionId(): Promise<number> {
    return this.actionRepo.count();
  }
}
