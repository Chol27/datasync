import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { Message } from 'src/entities/message.entity';
import { ActionEnum } from 'src/entities/action.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly actionService: ActionService,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepo.find({ relations: ['latestAction'] });
  }

  findById(uuid: string): Promise<Message> {
    return this.messageRepo.findOne({ uuid });
  }

  async create(dto: Partial<Message>): Promise<Message> {
    const message = this.messageRepo.create(dto);
    return this.messageRepo.save(message);
  }

  async createByActionId(): Promise<Message> {
    const action = await this.actionService.create(ActionEnum.Create);
    const { id } = action;
    const uuid = id.toString();
    const message = await this.create({
      uuid: uuid,
      author: 'author' + uuid,
      message: 'messages' + uuid,
      like: id,
      latestAction: action,
    });
    return message;
  }

  async createMultiple(iteration: number): Promise<any> {
    const messages = [];
    for (let i = 0; i < iteration; i++) {
      messages.push(await this.createByActionId());
    }
    return messages;
  }

  clearAll(): Promise<void> {
    return this.messageRepo.clear();
  }
}
