import { Test } from '@nestjs/testing';
import { TransformerService } from './transformer.service';
import { CollectProvidorMap } from '../collector/collector.constant';

describe('TransformerService Test', () => {
  let service: TransformerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TransformerService],
    }).compile();

    service = module.get<TransformerService>(TransformerService);
  });

  it('transform Test', async () => {
    expect(
      service.transform({
        postTitle: 'postTitle',
        postContent: '',
        likeCount: 0,
        postOriginUrl: '',
        providor: CollectProvidorMap.medium,
        createdAt: '2020-12-12 12:00:00',
        detectedAt: '2020-12-12 12:00:00',
      })
    ).rejects.toThrow();
  });
});
