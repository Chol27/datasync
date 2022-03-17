import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, ActionEnum } from 'src/entities/action.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  create(message: string, actionType: ActionEnum): Promise<Action> {
    const action = this.actionRepo.create({ message, actionType });
    return this.actionRepo.save(action);
  }

  update(id: number, dto: Partial<Action>): Promise<UpdateResult> {
    return this.actionRepo.update(id, dto);
  }
}
