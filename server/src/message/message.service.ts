import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionService } from 'src/action/action.service';
import { Message } from 'src/entities/message.entity';
import {
  MessageBatchService,
  NewBatchDTO,
} from 'src/message-batch/message-batch.service';
import { MoreThan, Repository } from 'typeorm';

export type PartitionFindDTO = {
  skip: number;
  take: number;
};

export type FetchAllDTO = {
  message?: Message[];
  newLatestActionId: number;
  partitionSets?: PartitionFindDTO[][];
};

export type NewUpdateDTO = {
  message: Partial<Message[]>;
  batch: NewBatchDTO;
  deletedCreateActionIds: number[];
  newLatestActionId: number;
};

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly batchService: MessageBatchService,
    private readonly actionService: ActionService,
  ) {}

  partitionFindAll(skip: number, take: number): Promise<Message[]> {
    return this.messageRepo.find({
      order: { createActionId: 'ASC' },
      skip,
      take,
    });
  }

  // async testFindAll(size: number): Promise<FetchAllDTO> {
  //   console.log('finding');
  //   const count = await this.actionService.getLatestActionId();
  //   let iterator = 0;
  //   const promises = [];
  //   while (iterator < count) {
  //     promises.push(
  //       this.messageRepo.find({
  //         order: { createActionId: 'ASC' },
  //         skip: iterator,
  //         take: Math.min(size, count - iterator),
  //       }),
  //     );
  //     iterator += size;
  //   }
  //   return {
  //     message: (await Promise.all(promises)).flat(),
  //     newLatestActionId: count,
  //   };
  // }

  // async testFindAll2(
  //   partitionSize: number,
  //   maxSize: number,
  // ): Promise<FetchAllDTO> {
  //   console.log('finding');
  //   const count = await this.actionService.getLatestActionId();
  //   let iterator = 0;
  //   const partitionSets = [];
  //   let partitionSet = [];
  //   const setSize = Math.floor(maxSize / partitionSize);
  //   if (setSize === 0) throw new BadRequestException();
  //   while (iterator < count) {
  //     partitionSet.push({
  //       skip: iterator,
  //       take: Math.min(partitionSize, count - iterator),
  //     });
  //     iterator += partitionSize;
  //     if (partitionSet.length === setSize) {
  //       partitionSets.push(partitionSet);
  //       partitionSet = [];
  //     }
  //   }
  //   return {
  //     newLatestActionId: count,
  //     partitionSets,
  //   };
  // }

  async findAll(): Promise<FetchAllDTO> {
    const count = await this.actionService.getLatestActionId();
    const maxSize = 250000;
    const isPartition = count > maxSize;
    const size = 250000;
    let iterator = 0;

    if (isPartition) {
      const setSize = Math.floor(maxSize / size);
      const partitionSets = [];
      let partitionSet = [];
      while (iterator < count) {
        partitionSet.push({
          skip: iterator,
          take: Math.min(size, count - iterator),
        });
        iterator += size;
        if (partitionSet.length === setSize) {
          partitionSets.push(partitionSet);
          partitionSet = [];
        }
      }
      return {
        newLatestActionId: count,
        partitionSets,
      };
    }

    const promises = [];
    while (iterator < count) {
      if (isPartition) {
        promises.push();
      }
      promises.push(
        this.messageRepo.find({
          order: { createActionId: 'ASC' },
          skip: iterator,
          take: Math.min(size, count - iterator),
        }),
      );
      iterator += size;
    }

    return {
      message: (await Promise.all(promises)).flat(),
      newLatestActionId: count,
    };
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
    const newLatestActionId = await this.actionService.getLatestActionId();
    return { message, batch, deletedCreateActionIds, newLatestActionId };
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
}
