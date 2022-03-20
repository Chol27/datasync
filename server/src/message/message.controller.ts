import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { FetchAllDTO, MessageService, NewUpdateDTO } from './message.service';
import { Message } from 'src/entities/message.entity';
import { Response } from 'express';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get()
  findAll(): Promise<FetchAllDTO> {
    return this.messageService.findAll();
  }

  @Get(':latestActionId')
  findByLatestActionId(
    @Param('latestActionId') latestActionId: number,
  ): Promise<NewUpdateDTO> {
    return this.messageService.findByLatestActionId(latestActionId);
  }

  @Post()
  async create(@Body() dto: Omit<Message, 'createActionId'>): Promise<Message> {
    try {
      return await this.messageService.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() dto: Partial<Message>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.messageService.update(uuid, dto);
      res.status(204).json();
    } catch (error) {
      throw error;
    }
  }

  @Delete(':uuid')
  async delete(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.messageService.delete(uuid);
      res.status(204).json();
    } catch (error) {
      throw error;
    }
  }
}
