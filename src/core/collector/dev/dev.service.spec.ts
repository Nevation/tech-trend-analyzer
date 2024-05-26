import { Test, TestingModule } from '@nestjs/testing';
import { CollectedPostResult } from '../collector.type';

import { CollectorDev } from './dev.service';
import { BaseDevPost, DevPost, DevPostDetail } from './dev.type';
import { CollectProvidorMap } from '../collector.constant';

class MockRequester {
  get = jest.fn();
}

describe('CollectorDev', () => {
  let service: CollectorDev;
  let requester: MockRequester;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectorDev, { provide: 'RETRY_REQUESTER', useClass: MockRequester }],
    }).compile();

    service = module.get<CollectorDev>(CollectorDev);
    requester = module.get<MockRequester>('RETRY_REQUESTER');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('collectBlogPost', () => {
    it('should collect blog posts', async () => {
      const mockBasePost: BaseDevPost = {
        type_of: 'article',
        id: 150589,
        title: 'Byte Sized Episode 2: The Creation of Graph Theory ',
        description:
          'The full story of Leonhard Euler and the creation of this fundamental computer science principle, delivered in a few minutes.',
        cover_image:
          'https://res.cloudinary.com/practicaldev/image/fetch/s--qgutBUrH--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/88e62fzblbluz1dm7xjf.png',
        readable_publish_date: 'Aug  1',
        social_image:
          'https://res.cloudinary.com/practicaldev/image/fetch/s--6wSHHfwd--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/88e62fzblbluz1dm7xjf.png',
        slug: 'byte-sized-episode-2-the-creation-of-graph-theory-34g1',
        path: '/bytesized/byte-sized-episode-2-the-creation-of-graph-theory-34g1',
        url: 'https://dev.to/bytesized/byte-sized-episode-2-the-creation-of-graph-theory-34g1',
        canonical_url: 'https://dev.to/bytesized/byte-sized-episode-2-the-creation-of-graph-theory-34g1',
        comments_count: 21,
        positive_reactions_count: 122,
        public_reactions_count: 322,
        collection_id: 1693,
        created_at: '2019-07-31T11:15:06Z',
        edited_at: null,
        crossposted_at: null,
        published_at: '2019-08-01T15:47:54Z',
        last_comment_at: '2019-08-06T16:48:10Z',
        published_timestamp: '2019-08-01T15:47:54Z',
        reading_time_minutes: 15,
        user: {
          name: 'Vaidehi Joshi',
          username: 'vaidehijoshi',
          twitter_username: 'vaidehijoshi',
          github_username: 'vaidehijoshi',
          website_url: 'http://www.vaidehi.com',
          profile_image:
            'https://res.cloudinary.com/practicaldev/image/fetch/s--eDGAYAoK--/c_fill,f_auto,fl_progressive,h_640,q_auto,w_640/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/2882/K2evUksb.jpg',
          profile_image_90:
            'https://res.cloudinary.com/practicaldev/image/fetch/s--htZnqMn3--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/2882/K2evUksb.jpg',
        },
        organization: {
          name: 'Byte Sized',
          username: 'bytesized',
          slug: 'bytesized',
          profile_image:
            'https://res.cloudinary.com/practicaldev/image/fetch/s--sq0DrZfn--/c_fill,f_auto,fl_progressive,h_640,q_auto,w_640/https://thepracticaldev.s3.amazonaws.com/uploads/organization/profile_image/865/652f7998-32a8-4fd9-85ca-dd697d2a9ee9.png',
          profile_image_90:
            'https://res.cloudinary.com/practicaldev/image/fetch/s--1Pt_ICL---/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://thepracticaldev.s3.amazonaws.com/uploads/organization/profile_image/865/652f7998-32a8-4fd9-85ca-dd697d2a9ee9.png',
        },
      };
      const mockPost: DevPost = {
        ...mockBasePost,
        tags: 'computerscience, graphtheory, bytesized, history',
        tag_list: ['computerscience', 'graphtheory', 'bytesized', 'history'],
      };
      const mockPostDetail: DevPostDetail = {
        ...mockBasePost,
        tag_list: 'computerscience, graphtheory, bytesized, history',
        tags: ['computerscience', 'graphtheory', 'bytesized', 'history'],
        body_html:
          '<p>Today\'s episode of Byte Sized is about Leonhard Euler and the creation of <a href="https://en.wikipedia.org/wiki/Graph_theory">Graph Theory</a>.</p>\n\n<p>For more about how Graph Theory works, check out this video from BaseCS!</p>...\n',
        body_markdown:
          "---\r\ntitle: Byte Sized Episode 2: The Creation of Graph Theory \r\npublished: true\r\ndescription: The full story of Leonhard Euler and the creation of this fundamental computer science principle, delivered in a few minutes.\r\ntags: computerscience, graphtheory, bytesized, history\r\ncover_image: https://thepracticaldev.s3.amazonaws.com/i/88e62fzblbluz1dm7xjf.png\r\nseries: Byte Sized Season 1\r\n---\r\n\r\nToday's episode of Byte Sized is about Leonhard Euler and the creation of [Graph Theory](https://en.wikipedia.org/wiki/Graph_theory).\r\n\r\nFor more about how Graph Theory works, check out this video from BaseCS!...",
      };

      requester.get.mockResolvedValueOnce([mockPost]).mockResolvedValue(mockPostDetail);

      const result: CollectedPostResult = await service.collectBlogPost();
      const { collectedPostList } = result;
      const [post] = collectedPostList;

      expect(result.collectedAt).toBeDefined();
      expect(collectedPostList.length).toBe(1);
      expect(post.postTitle).toBe(mockPost.title);
      expect(post.postContent).toBe(mockPostDetail.body_markdown);
      expect(post.writer).toBe(`${service.getProvidor()}-${mockPost.user.name}`);
      expect(post.likeCount).toBe(mockPost.positive_reactions_count);
      expect(post.postTags).toEqual(mockPost.tag_list);
      expect(post.providor).toBe(service.getProvidor());
      expect(post.postOriginUrl).toBe(mockPost.url);
    });
  });

  describe('getProvidor', () => {
    it('should return provider name', () => {
      expect(service.getProvidor()).toBe(CollectProvidorMap.dev);
    });
  });
});
