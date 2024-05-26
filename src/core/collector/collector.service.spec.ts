import { Test } from '@nestjs/testing';
import { CollectorService } from './collector.service';
import { CollectorMedium } from './medium/medium.service';
import { CollectProvidorMap } from './collector.constant';

describe('CollectorService', () => {
  let service: CollectorService;

  const collectedAt = new Date().toISOString();
  const collectedPostList = [
    {
      postTitle: 'Test Post',
      postContent: 'Test Content',
      writer: 'Test Writer',
      likeCount: 10,
      postTags: ['test'],
      providor: 'MEDIUM',
      postOriginUrl: 'https://medium.com/test-post',
      createdAt: new Date().toISOString(),
      detectedAt: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CollectorService,
        {
          provide: CollectorMedium,
          useValue: {
            collectBlogPost: () => ({ collectedAt, collectedPostList }),
            getProvidor: () => CollectProvidorMap.medium,
          },
        },
      ],
    }).compile();

    service = module.get<CollectorService>(CollectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('collectPost', () => {
    it('should collect posts from all strategies', async () => {
      const result = await service.collectPost();
      expect(result).toEqual([{ collectedAt, collectedPostList }]);
    });
  });
});
