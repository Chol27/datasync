import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Res,
  ParseIntPipe,
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

  @Get('partition/:skip/:take')
  partitionFindAll(
    @Param('skip', ParseIntPipe) skip: number,
    @Param('take', ParseIntPipe) take: number,
  ): Promise<Message[]> {
    return this.messageService.partitionFindAll(skip, take);
  }

  // @Get('test/:size')
  // testFindAll(@Param('size', ParseIntPipe) size: number): Promise<any> {
  //   console.log('nm', typeof size);
  //   return this.messageService
  //     .testFindAll(size)
  //     .then((dt) => {
  //       console.log('size', dt.message.length);
  //       return { message: 'success' };
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //       return { message: 'error' };
  //     });
  // }

  // @Get('test2/:take/:max')
  // testFindAll2(
  //   @Param('take', ParseIntPipe) take: number,
  //   @Param('max', ParseIntPipe) max: number,
  // ): Promise<any> {
  //   return this.messageService.testFindAll2(take, max);
  // }

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
