import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import { Repository } from 'typeorm';

export type MessageBatchCreateDTO = {
  batchType: string;
  actionId: number;
  messageCreateActionId: number;
  updatedValue: string | number;
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
