import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { Message } from 'src/entities/message.entity';
import { MessageBatchModule } from 'src/message-batch/message-batch.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ActionModule,
    MessageBatchModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
