import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { Message } from 'src/entities/message.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import {
  MessageBatchService,
  NewBatchDTO,
} from 'src/message-batch/message-batch.service';
import { MoreThan, Repository } from 'typeorm';

export type NewUpdateDTO = {
  message: Partial<Message[]>;
  batch: NewBatchDTO;
  deletedCreateActionIds: number[];
};

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly batchService: MessageBatchService,
    private readonly actionService: ActionService,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepo.find({
      order: { createActionId: 'ASC' },
    });
  }

  async findByLatestActionId(latestActionId: number): Promise<NewUpdateDTO> {
    const message = await this.messageRepo.find({
      order: { createActionId: 'ASC' },
      where: { createActionId: MoreThan(latestActionId) },
      select: ['uuid', 'author', 'message', 'likes', 'createActionId'],
    });
    const batch = await this.batchService.findByLatestActionId(latestActionId);
    const deletedCreateActionIds = (
      await this.actionService.findDeleteTypeByLatestId(latestActionId)
    ).map((obj) => obj.messageCreateId);
    return { message, batch, deletedCreateActionIds };
  }

  async findById(uuid: string): Promise<Message> {
    const message = await this.messageRepo.findOne({ uuid });
    if (!message) throw new BadRequestException();
    return message;
  }

  async create(dto: Omit<Message, 'createActionId'>): Promise<Message> {
    try {
      return await this.messageRepo.save(this.messageRepo.create(dto));
    } catch (error) {
      throw new ConflictException('This message uuid is already created');
    }
  }

  async update(uuid: string, dto: Partial<Message>): Promise<Message> {
    try {
      const message = Object.assign(await this.findById(uuid), dto);
      return this.messageRepo.save(message);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async delete(uuid: string): Promise<Message> {
    const message = await this.findById(uuid);
    if (!message) {
      throw new NotFoundException();
    }
    return this.messageRepo.remove(message);
  }
  p;
}
