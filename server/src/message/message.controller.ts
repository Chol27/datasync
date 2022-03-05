import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';
import { ActionService } from 'src/action/action.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly actionService: ActionService,
  ) {}
  @Get()
  findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Post('multiple/:iteration')
  createMultiple(@Param('iteration') iteration: number): Promise<Message[]> {
    return this.messageService.createMultiple(iteration);
  }

  @Delete('clear')
  clearAll(): Promise<void> {
    return this.messageService.clearAll();
    // return this.messageService.clearAll();
  }
}
