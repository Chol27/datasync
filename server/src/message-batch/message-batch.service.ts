import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

export type MessageBatchCreateDTO = {
  batchType: string;
  actionId: number;
  messageCreateActionId: number;
  updatedValue: string | number;
};

export type NewBatchDTO = {
  author: Partial<AuthorMessageBatch[]>;
  message: Partial<TextMessageBatch[]>;
  likes: Partial<LikesMessageBatch[]>;
};

@Injectable()
export class MessageBatchService {
  constructor(
    @InjectRepository(AuthorMessageBatch)
    private readonly authorBatchRepo: Repository<AuthorMessageBatch>,
    @InjectRepository(TextMessageBatch)
    private readonly textBatchRepo: Repository<TextMessageBatch>,
    @InjectRepository(LikesMessageBatch)
    private readonly likesBatchRepo: Repository<LikesMessageBatch>,
  ) {}

  batchMapper = {
    author: this.authorBatchRepo,
    message: this.textBatchRepo,
    likes: this.likesBatchRepo,
  };

  async findByLatestActionId(latestActionId: number): Promise<NewBatchDTO> {
    const result = { author: [], message: [], likes: [] };
    Object.keys(this.batchMapper).forEach(async (key) => {
      const repository = this.batchMapper[key];
      result[key] = await repository.find({
        order: { messageCreateActionId: 'DESC' },
        where: {
          isLatest: true,
          messageCreateActionId: LessThanOrEqual(latestActionId),
        },
        select: ['messageCreateActionId', 'updatedValue'],
      });
    });
    return result;
  }

  async create(dto: MessageBatchCreateDTO) {
    const { batchType, updatedValue, messageCreateActionId, ...batch } = dto;
    const repository = this.batchMapper[batchType];
    await this.updateLatest(batchType, messageCreateActionId);
    return repository.save({ ...batch, messageCreateActionId, updatedValue });
  }

  async updateLatest(batchType: string, messageCreateActionId: number) {
    const repository = this.batchMapper[batchType];
    const oldBatch = await repository.findOne({
      isLatest: true,
      messageCreateActionId,
    });
    if (oldBatch) {
      repository.update(oldBatch.actionId, { isLatest: false });
    }
  }
}
