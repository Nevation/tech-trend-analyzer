import { Inject, Logger } from '@nestjs/common';
import { CollectProvidorMap } from '../collector.constant';
import { CollectorStrategy } from '../collector.strategy';
import { CollectedPost, CollectedPostResult } from '../collector.type';
import { Requester } from '../../../utils/requester';
import { plainToInstance } from 'class-transformer';
import { DevPost, DevPostDetail } from './dev.type';

export class CollectorDev extends CollectorStrategy {
  private readonly tags = ['programming'];
  private readonly pageSize = 5;
  private readonly maxNum = 100;
  private readonly requestUrl = 'https://dev.to/api/articles';

  constructor(@Inject('RETRY_REQUESTER') private readonly requester: Requester) {
    super();
  }

  public async collectBlogPost(): Promise<CollectedPostResult> {
    const collectedPostList: CollectedPost[] = [];
    const collectedAt = new Date().toISOString();

    try {
      for (const tag of this.tags) {
        // NOTE: https://developers.forem.com/api/v0#tag/articles/operation/getArticles
        // API 명세에 page 값은 1부터 시작
        for (let page = 1; page <= this.maxNum; page += this.pageSize) {
          const query: Record<string, any> = { tag, page, per_page: this.pageSize };
          const posts = await this.requester.get<DevPost[]>(this.requestUrl, query);

          const postContentPromises = posts.map((post) =>
            this.requester.get<DevPostDetail>(this.requestUrl + `/${post.id}`)
          );
          const postContents = await Promise.all(postContentPromises);
          const postContentMap = postContents.reduce((a, c) => ({ ...a, [c.id]: c.body_markdown }), {});

          const collectedPosts = posts.map((post) =>
            this.convertDevPostToCollectedPost(post, postContentMap[post.id], collectedAt)
          );
          collectedPostList.push(...collectedPosts);
          if (posts.length < this.pageSize) break;
        }
      }
    } catch (error) {
      throw new Error('Failed to collect blog post data.');
    }

    return {
      collectedAt,
      collectedPostList,
    };
  }

  public getProvidor() {
    return CollectProvidorMap.dev;
  }

  private convertDevPostToCollectedPost = (post: DevPost, content: string, collectedAt: string): CollectedPost => {
    Logger.debug(`${this.getProvidor()} ${post.title}`);

    return plainToInstance(CollectedPost, {
      postTitle: post.title,
      postContent: content,
      writer: `${this.getProvidor()}-${post.user.name}`,
      likeCount: post.positive_reactions_count,
      postTags: post.tag_list,
      providor: this.getProvidor(),
      postOriginUrl: post.url,
      detectedAt: collectedAt,
    });
  };
}
