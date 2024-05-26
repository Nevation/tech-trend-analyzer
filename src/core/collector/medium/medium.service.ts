import { CollectorStrategy } from '../collector.strategy';
import { CollectedPost, type CollectedPostResult } from '../collector.type';
import { CollectProvidorMap } from '../collector.constant';
import * as fs from 'fs';
import type { MediumGraphQLResponse, MediumPost } from './medium.type';
import { MarkdownConverter } from './markdownConverter';
import { plainToInstance } from 'class-transformer';
import { Inject, Logger } from '@nestjs/common';
import { Requester } from '../../../utils/requester';

export class CollectorMedium extends CollectorStrategy {
  private readonly queryFile = '/LegacyWebInlineTopicFeedQuery.gql';
  private readonly operationName = 'LegacyWebInlineTopicFeedQuery';
  private readonly tags = ['programming'];
  private readonly pageSize = 5; // NOTE: MAXIMUM 25, medium에서 제한함
  private readonly maxNum = 100;
  private readonly query: string;

  private readonly requestUrl = 'https://medium.com/_/graphql';
  private readonly requestHeader: Record<string, string>;

  constructor(
    private readonly markdownConverter: MarkdownConverter,
    @Inject('RETRY_REQUESTER') private readonly requester: Requester
  ) {
    super();
    this.query = this.loadGraphQLQuery();
    this.requestHeader = {
      accept: '*/*',
      'content-type': 'application/json',
      'graphql-operation': this.operationName,
      Cookie:
        'nonce=ZZxSZxXB; uid=de6e55174ae7; _ga=GA1.1.2007462361.1680482903; sid=1:H0cwoTVQTd6lwRXJ14edt5/xlo25eKQjpkVQv6ajMLct9z7+TjTFMcab7+jHEKtF; xsrf=6e705e0824e7; _ga_7JY7T788PK=GS1.1.1711074725.102.1.1711075467.0.0.0; _dd_s=rum=0&expire=1711076371261; dd_cookie_test_f138af8e-9a30-4a29-847e-b143fa745515=test; dd_cookie_test_3c1b88d9-ac52-4773-ab45-ab2df5dc8833=test; dd_cookie_test_f859b8c1-00dd-4efd-a7bf-eb5942862626=test',
      // Cookie: process.env['MEDIUM_COOKIE'],
    };
  }

  public async collectBlogPost(): Promise<CollectedPostResult> {
    const collectedPostList: CollectedPost[] = [];
    const collectedAt = new Date().toISOString();

    try {
      for (const tag of this.tags) {
        for (let page = 0; page < this.maxNum; page += this.pageSize) {
          const body = this.makeResponseBody(tag, page, this.pageSize);
          const posts = await this.fetchBlogPosts(body);
          const collectedPosts = posts.map((post) => this.convertMediumPostToCollectedPost(post, collectedAt));
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
    return CollectProvidorMap.medium;
  }

  private loadGraphQLQuery(): string {
    return fs.readFileSync(__dirname + this.queryFile, { encoding: 'utf8' });
  }

  private convertMediumPostToCollectedPost = (post: MediumPost, collectedAt: string) => {
    Logger.debug(post.title);

    return plainToInstance(CollectedPost, {
      postTitle: post.title,
      postContent: this.markdownConverter.convertToMarkdown(post),
      writer: `${this.getProvidor()}-${post.creator.name}`,
      likeCount: post.clapCount,
      postTags: post.tags.map((tag) => tag.normalizedTagSlug),
      providor: this.getProvidor(),
      postOriginUrl: post.mediumUrl,
      detectedAt: collectedAt,
    });
  };

  private async fetchBlogPosts(body: object): Promise<MediumPost[]> {
    const response = await this.requester.post<MediumGraphQLResponse[]>(this.requestUrl, body, this.requestHeader);
    const [{ data }] = response;
    return data.personalisedTagFeed.items.map(({ post }) => post);
  }

  private makeResponseBody(tag: string, skip: number, limit: number = 5) {
    const from = skip.toString();
    const to = (skip + limit).toString();
    return [
      {
        operationName: this.operationName,
        variables: {
          tagSlug: tag,
          paging: { limit, from, to },
          postMeteringOptions: {},
          skipCache: false,
        },
        query: this.query,
      },
    ];
  }
}
