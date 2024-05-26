import { Test, TestingModule } from '@nestjs/testing';
import { CollectorMedium } from './medium.service';
import { MarkdownConverter } from './markdownConverter';
import { CollectedPostResult } from '../collector.type';
import { MediumPost, MediumGraphQLResponse } from './medium.type';
import { CollectProvidorMap } from '../collector.constant';

class MockRequester {
  post = jest.fn();
}

class MockMarkdownConverter {
  convertToMarkdown = jest.fn();
}

describe('CollectorMedium', () => {
  let service: CollectorMedium;
  let requester: MockRequester;
  let markdownConverter: MockMarkdownConverter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectorMedium,
        { provide: 'RETRY_REQUESTER', useClass: MockRequester },
        { provide: MarkdownConverter, useClass: MockMarkdownConverter },
      ],
    }).compile();

    service = module.get<CollectorMedium>(CollectorMedium);
    requester = module.get<MockRequester>('RETRY_REQUESTER');
    markdownConverter = module.get<MockMarkdownConverter>(MarkdownConverter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('collectBlogPost', () => {
    it('should collect blog posts', async () => {
      const mockPost: MediumPost = {
        title: 'Test Post',
        description: 'Test Description',
        clapCount: 10,
        content: {
          bodyModel: {
            paragraphs: [{ type: 'P', text: 'Test paragraph', language: '', markups: [] }],
          },
        },
        creator: { name: 'Kim' },
        tags: [{ normalizedTagSlug: 'test' }],
        mediumUrl: 'https://medium.com/test-post',
      };

      const mockResponse: MediumGraphQLResponse = {
        data: {
          personalisedTagFeed: {
            items: [{ post: mockPost }],
          },
        },
      };

      const mockConvertResult = 'Converted Markdown';

      requester.post.mockResolvedValue([mockResponse]);
      markdownConverter.convertToMarkdown.mockReturnValue(mockConvertResult);

      const result: CollectedPostResult = await service.collectBlogPost();
      const { collectedPostList } = result;
      const [post] = collectedPostList;

      expect(result.collectedAt).toBeDefined();
      expect(collectedPostList.length).toBe(1);
      expect(post.postTitle).toBe(mockPost.title);
      expect(post.postContent).toBe(mockConvertResult);
      expect(post.writer).toBe(`${service.getProvidor()}-${mockPost.creator.name}`);
      expect(post.likeCount).toBe(mockPost.clapCount);
      expect(post.postTags).toEqual(mockPost.tags.map((tag) => tag.normalizedTagSlug));
      expect(post.providor).toBe(service.getProvidor());
      expect(post.postOriginUrl).toBe(mockPost.mediumUrl);
    });
  });

  describe('getProvidor', () => {
    it('should return provider name', () => {
      expect(service.getProvidor()).toBe(CollectProvidorMap.medium);
    });
  });
});
