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

  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.messageService.delete(uuid);
  }
}
