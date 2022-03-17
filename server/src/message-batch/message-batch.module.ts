import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorMessageBatch } from 'src/entities/author-message-batch.entity';
import { LikesMessageBatch } from 'src/entities/likes-message-batch.entity';
import { TextMessageBatch } from 'src/entities/text-message-batch.entity';
import { MessageBatchService } from './message-batch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthorMessageBatch,
      TextMessageBatch,
      LikesMessageBatch,
    ]),
  ],
  providers: [MessageBatchService],
  exports: [MessageBatchService],
})
export class MessageBatchModule {}
