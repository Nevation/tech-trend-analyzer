interface MediumGraphQLResponse {
  data: {
    personalisedTagFeed: {
      items: Array<{ post: MediumPost }>;
    };
  };
}

interface MediumPost {
  title: string;
  description: string;
  clapCount: number;
  content: {
    bodyModel: {
      paragraphs: MediumPostParagraph[];
    };
  };
  creator: {
    name: string;
  };
  tags: Array<{
    normalizedTagSlug: string;
  }>;
  mediumUrl: string;
}

interface MediumPostParagraph {
  type: string;
  text: string;
  language: string;
  metadata?: {
    id: string;
  };
  markups: MediumPostParagraphMarkup[];
}

interface MediumPostParagraphMarkup {
  type: string;
  start: number;
  end: number;
  href?: string;
  language?: string;
}

export type { MediumGraphQLResponse, MediumPost, MediumPostParagraph, MediumPostParagraphMarkup };
