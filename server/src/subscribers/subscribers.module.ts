import { Module } from '@nestjs/common';
import { ActionModule } from 'src/action/action.module';
import { MessageBatchModule } from 'src/message-batch/message-batch.module';
import { MessageSubscriber } from './message.subscriber';

@Module({
  imports: [ActionModule, MessageBatchModule],
  providers: [MessageSubscriber],
})
export class SubscribersModule {}
