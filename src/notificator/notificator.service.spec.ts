import { Test } from '@nestjs/testing';
import { NotificatorService } from './notificator.service';

describe('NotificatorService Test', () => {
  let service: NotificatorService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [NotificatorService],
    }).compile();

    service = module.get<NotificatorService>(NotificatorService);
  });

  it('notify Test', async () => {
    expect(service.notify()).rejects.toThrow();
  });
});
