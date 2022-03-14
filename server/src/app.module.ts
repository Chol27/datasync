import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { ActionModule } from './action/action.module';
import { MessageBatchModule } from './message-batch/message-batch.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/**/*{.js,.ts}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    MessageModule,
    ActionModule,
    MessageBatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
