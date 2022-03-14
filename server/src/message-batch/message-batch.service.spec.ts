import { Test, TestingModule } from '@nestjs/testing';
import { MessageBatchService } from './message-batch.service';

describe('MessageBatchService', () => {
  let service: MessageBatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageBatchService],
    }).compile();

    service = module.get<MessageBatchService>(MessageBatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
