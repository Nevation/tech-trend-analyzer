export class CollectedPost {
  postTitle: string;
  postContent: string;
  writer?: string;

  likeCount: number;
  postTags?: string[];

  providor: string;
  postOriginUrl: string;

  createdAt: string;
  detectedAt: string;
}

export interface CollectedPostResult {
  collectedAt: string;
  collectedPostList: CollectedPost[];
}
