import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/entities/action.entity';
import { ActionService } from './action.service';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
