import type { MediumPost, MediumPostParagraph } from './medium.type';

export class MarkdownConverter {
  static convertToMarkdown(post: MediumPost): string {
    let markdown = `# ${post.title}\n\n`;

    if (post.description) {
      markdown += `_${post.description}_\n\n`;
    }

    post.content.bodyModel.paragraphs.forEach((paragraph) => {
      markdown += this.paragraphToMarkdown(paragraph);
    });

    markdown += `---\n\n`;
    return markdown;
  }

  static paragraphToMarkdown(paragraph: MediumPostParagraph): string {
    switch (paragraph.type) {
      case 'H3':
        return `### ${paragraph.text}\n\n`;
      case 'H4':
        return `#### ${paragraph.text}\n\n`;
      case 'OLI':
        // FIXME: 로직 수정 필요
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

  static imageToMarkdown(id: string): string {
    return id ? `![image](https://miro.medium.com/v2/resize:fit:1000/${id})\n\n` : '';
  }

  static embedToMarkdown(text: string, markups: any[]): string {
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

  static textToMarkdown(text: string, markups: any[]): string {
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

  static codeToMarkdown(text: string, language: string = ''): string {
    return '```' + language + '\n' + text + '\n```\n\n';
  }

  private static applyLink(text: string, href: string, start: number, end: number): string {
    return `${text.substring(0, start)}[${text.substring(start, end)}](${href})${text.substring(end)}`;
  }

  private static applyMarkup(text: string, markup): string {
    const markupTypes = {
      STRONG: '**', // 볼드 처리
      EM: '_', // 이탤릭 처리
    };
    const { start, end, type } = markup;
    const wrapWith = markupTypes[type];
    return `${text.substring(0, start)}${wrapWith}${text.substring(start, end)}${wrapWith}${text.substring(end)}`;
  }
}
