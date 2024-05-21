import { Injectable } from '@nestjs/common';
import type { MediumPost, MediumPostParagraph, MediumPostParagraphMarkup } from './medium.type';

@Injectable()
export class MarkdownConverter {
  public convertToMarkdown(post: MediumPost): string {
    let markdown = `# ${post.title}\n\n`;

    if (post.description) {
      markdown += `_${post.description}_\n\n`;
    }

    post.content.bodyModel.paragraphs.forEach((paragraph) => {
      markdown += this.paragraphToMarkdown(paragraph);
    });

    return markdown;
  }

  private paragraphToMarkdown(paragraph: MediumPostParagraph): string {
    switch (paragraph.type) {
      case 'H3':
        return `### ${paragraph.text}\n\n`;
      case 'H4':
        return `#### ${paragraph.text}\n\n`;
      case 'OLI':
        return `1. ${paragraph.text}\n`;
      case 'ULI':
        return `- ${paragraph.text}\n`;
      case 'BLOCKQUOTE':
        return `> ${paragraph.text}\n\n`;
      case 'PQ':
        return `> **${paragraph.text}**\n\n`;
      case 'IMG':
        return this.imageToMarkdown(paragraph.metadata.id);
      case 'MIXTAPE_EMBED':
        return this.embedToMarkdown(paragraph.text, paragraph.markups);
      case 'P':
        return this.textToMarkdown(paragraph.text, paragraph.markups);
      case 'PRE':
      case 'CODE':
        return this.codeToMarkdown(paragraph.text, paragraph.language);
      default:
        return paragraph.text + '\n\n';
    }
  }

  private imageToMarkdown(id: string): string {
    return `![image](https://miro.medium.com/v2/resize:fit:1000/${id})\n\n`;
  }

  private embedToMarkdown(text: string, markups: MediumPostParagraphMarkup[]): string {
    let embedText = text.replace(/\n/g, '');
    markups
      .slice()
      .reverse()
      .forEach((markup) => {
        if (markup.type === 'A') {
          embedText = this.applyLink(embedText, markup.href, markup.start, markup.end);
        }
      });
    return `${embedText}\n\n`;
  }

  private textToMarkdown(text: string, markups: MediumPostParagraphMarkup[]): string {
    markups
      .slice()
      .reverse()
      .forEach((markup) => {
        if (markup.type === 'A') {
          text = this.applyLink(text, markup.href, markup.start, markup.end);
        } else {
          text = this.applyMarkup(text, markup);
        }
      });
    return `${text}\n\n`;
  }

  private codeToMarkdown(text: string, language: string = ''): string {
    return '```' + language + '\n' + text + '\n```\n\n';
  }

  private applyLink(text: string, href: string, start: number, end: number): string {
    return `${text.substring(0, start)}[${text.substring(start, end)}](${href})${text.substring(end)}`;
  }

  private applyMarkup(text: string, markup): string {
    const markupTypes = {
      STRONG: '**', // 볼드 처리
      EM: '_', // 이탤릭 처리
    };
    const { start, end, type } = markup;
    const wrapWith = markupTypes[type];
    return `${text.substring(0, start)}${wrapWith}${text.substring(start, end)}${wrapWith}${text.substring(end)}`;
  }
}
