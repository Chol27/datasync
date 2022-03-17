import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from 'src/entities/message.entity';
import { Response } from 'express';

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
  async delete(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      await this.messageService.delete(uuid);
      return res.status(204).json();
    } catch (error) {
      throw error;
    }
  }
}
