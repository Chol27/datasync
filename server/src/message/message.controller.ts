import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get()
  findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Post()
  create(@Body() dto: Partial<Message>): Promise<Message> {
    return this.messageService.create(dto);
  }

  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: Partial<Message>,
  ): Promise<Message> {
    return this.messageService.update(uuid, dto);
  }

  /*
   * Below function is for testing purpose.
   * Need to close @BeforeInsert at MessageEntity before using createMultiple.
   */
  @Post('multiple/:iteration')
  createMultiple(@Param('iteration') iteration: number): Promise<Message[]> {
    return this.messageService.createMultiple(iteration);
  }

  @Delete('clear')
  clearAll(): Promise<void> {
    return this.messageService.clearAll();
  }
}
