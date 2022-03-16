import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { Message } from 'src/entities/message.entity';
import { ActionEnum } from 'src/entities/action.entity';
import { Repository } from 'typeorm';
import { UpdatedColumnEnum } from 'src/entities/message-batch.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly actionService: ActionService,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepo.find({
      relations: ['createActionId'],
      order: { latestAction: 'ASC' },
    });
  }

  async findById(uuid: string): Promise<Message> {
    const message = await this.messageRepo.findOne({ uuid });
    if (!message) throw new BadRequestException();
    return message;
  }

  create(dto: Partial<Message>): Promise<Message> {
    return this.messageRepo.save(this.messageRepo.create(dto));
  }

  async update(uuid: string, dto: Partial<Message>): Promise<Message> {
    const message = Object.assign(await this.findById(uuid), dto);
    return this.messageRepo.save(message);
  }

  /*
   * Below function is for testing purpose.
   *
   */

  async createByActionId(): Promise<Message> {
    const action = await this.actionService.create(ActionEnum.Create);
    const { id } = action;
    const uuid = id.toString();
    const message = await this.create({
      uuid: uuid,
      author: 'author' + uuid,
      message: 'messages' + uuid,
      likes: id,
      latestAction: action,
      createActionId: action.id,
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
