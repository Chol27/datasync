import { Module } from '@nestjs/common';
import { MessageBatchService } from './message-batch.service';

@Module({
  providers: [MessageBatchService],
  exports: [MessageBatchService],
})
export class MessageBatchModule {}
