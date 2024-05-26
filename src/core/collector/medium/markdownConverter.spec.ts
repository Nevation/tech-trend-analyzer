import { MarkdownConverter } from './markdownConverter';
import { MediumPost } from './medium.type';

describe('MarkdownConverter', () => {
  let markdownConverter: MarkdownConverter;

  beforeEach(() => {
    markdownConverter = new MarkdownConverter();
  });

  describe('convertToMarkdown', () => {
    it('should convert MediumPost to Markdown', () => {
      const post: MediumPost = {
        title: 'Test Post',
        description: 'Test Description',
        clapCount: 10,
        content: {
          bodyModel: {
            paragraphs: [
              { type: 'H3', text: 'Header 3', markups: [] },
              { type: 'H4', text: 'Header 4', markups: [] },
              { type: 'OLI', text: 'OLI test', markups: [] },
              { type: 'ULI', text: 'ULI test', markups: [] },
              { type: 'BLOCKQUOTE', text: 'BLOCKQUOTE test', markups: [] },
              { type: 'PQ', text: 'PQ test', markups: [{ type: 'A', start: 0, end: 6, href: 'https://example.com' }] },
              { type: 'IMG', text: '', markups: [], metadata: { id: 'test_id.jpeg' } },
              {
                type: 'MIXTAPE_EMBED',
                text: 'MIXTAPE_EMBED test',
                markups: [{ type: 'A', start: 0, end: 18, href: 'https://example.com' }],
              },
              { type: 'P', text: 'This is a paragraph.', markups: [] },
              {
                type: 'P',
                text: 'This is a hyperlink paragraph.',
                markups: [{ type: 'A', start: 0, end: 30, href: 'https://example.com' }],
              },
              {
                type: 'P',
                text: 'This is a strong paragraph.',
                markups: [{ type: 'STRONG', start: 0, end: 27, href: null }],
              },
              {
                type: 'P',
                text: 'This is a italic paragraph.',
                markups: [{ type: 'EM', start: 0, end: 27, href: null }],
              },
              { type: 'PRE', text: "function show() {\n  console.log('show function');\n}\n\nshow();", markups: [] },
              { type: 'CODE', text: 'const x = 10;', language: 'javascript', markups: [] },
              { type: 'UNEXPECTED_TYPE', text: 'UNEXPECTED_TYPE', markups: [] },
            ],
          },
        },
        creator: { name: 'John Doe' },
        tags: [{ normalizedTagSlug: 'test' }],
        mediumUrl: 'https://medium.com/test-post',
      };

      const expectedMarkdown =
        "# Test Post\n\n_Test Description_\n\n### Header 3\n\n#### Header 4\n\n1. OLI test\n- ULI test\n> BLOCKQUOTE test\n\n> **PQ test**\n\n![image](https://miro.medium.com/v2/resize:fit:1000/test_id.jpeg)\n\n[MIXTAPE_EMBED test](https://example.com)\n\nThis is a paragraph.\n\n[This is a hyperlink paragraph.](https://example.com)\n\n**This is a strong paragraph.**\n\n_This is a italic paragraph._\n\n```\nfunction show() {\n  console.log('show function');\n}\n\nshow();\n```\n\n```javascript\nconst x = 10;\n```\n\nUNEXPECTED_TYPE\n\n";
      expect(markdownConverter.convertToMarkdown(post)).toBe(expectedMarkdown);
    });
  });
});
