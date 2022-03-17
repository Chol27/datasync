import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, ActionEnum } from 'src/entities/action.entity';
import { MoreThan, Repository, UpdateResult } from 'typeorm';

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

  findDeleteTypeByLatestId(latestActionId: number) {
    return this.actionRepo.find({
      where: { actionType: ActionEnum.Delete, id: MoreThan(latestActionId) },
      select: ['messageCreateId'],
    });
  }
}
