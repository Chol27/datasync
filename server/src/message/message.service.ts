import {
  BadRequestException,
  Catch,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
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

  async delete(uuid: string): Promise<void> {
    const updateResult = await this.messageRepo.delete(uuid);
    const { affected } = updateResult;
    if (affected === 0) {
      throw new NotFoundException();
    }
    return;
  }
}
