import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import { getConnection, Repository } from 'typeorm';

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

  async findByLatestActionId(latestActionId: number): Promise<any> {
    const entries = await Promise.all(
      Object.entries(this.batchMapper).map(async ([batchType, repository]) => {
        const orderedBatchQuery = repository
          .createQueryBuilder('batch')
          // .select(`aa.message_create_action_id, aa.updated_value`)
          .select('batch.actionId', 'actionId')
          .addSelect('batch.messageCreateActionId', 'messageCreateActionId')
          .addSelect('batch.updatedValue', 'updatedValue')
          .where('batch.isLatest=TRUE')
          .orderBy({
            'batch.actionId': 'DESC',
            'batch.messageCreateActionId': 'ASC',
          })
          .getQuery();
        // typeorm is incompatible with postgres?
        const query = `SELECT * FROM (${orderedBatchQuery})ob WHERE ob."actionId" > ${latestActionId} AND ob."messageCreateActionId" <= ${latestActionId};`;
        return [batchType, await getConnection().query(query)];
      }),
    );
    return Object.fromEntries(entries);
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
