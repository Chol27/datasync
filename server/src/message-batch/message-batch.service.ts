import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorMessageBatch } from 'src/entities/authorMessageBatch.entity';
import { LikesMessageBatch } from 'src/entities/likesMessageBatch.entity';
import {
  MessageBatch,
  UpdatedColumnEnum,
} from 'src/entities/messageBatch.entity';
import { TextMessageBatch } from 'src/entities/textMessageBatch.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

class createDto extends MessageBatch {
  updatedColumn: UpdatedColumnEnum;
  updatedValue: string | number;
}

@Injectable()
export class MessageBatchService {
  constructor(
    @InjectRepository(AuthorMessageBatch)
    private readonly authorRepository: Repository<AuthorMessageBatch>,
    @InjectRepository(TextMessageBatch)
    private readonly textRepository: Repository<TextMessageBatch>,
    @InjectRepository(LikesMessageBatch)
    private readonly likesRepository: Repository<LikesMessageBatch>,
  ) {}

  create(
    dto: createDto,
  ): Promise<AuthorMessageBatch | TextMessageBatch | LikesMessageBatch> {
    const { updatedColumn, updatedValue, ...other } = dto;
    if (
      updatedColumn === UpdatedColumnEnum.Author &&
      _.isString(updatedValue)
    ) {
      return this.authorRepository.save({ updatedValue, ...other });
    }
    if (
      updatedColumn === UpdatedColumnEnum.Message &&
      _.isString(updatedValue)
    ) {
      return this.textRepository.save({ updatedValue, ...other });
    }
    if (updatedColumn === UpdatedColumnEnum.Likes && _.isNumber(updatedValue)) {
      return this.likesRepository.save({ updatedValue, ...other });
    }
  }
}
