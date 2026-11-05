import { BadRequestException, Injectable } from '@nestjs/common';
import { Site } from '../schemas/site.model.js';


@Injectable()
export class SiteService {
  private makeSnippet(text: string, q: string): string {
    const lower = text.toLowerCase();
    const word = q.toLowerCase().split(/\s+/).find((w) => w && lower.includes(w));
    if (!word) return text.slice(0, 160);

    const at = lower.indexOf(word);
    const start = Math.max(0, at - 60);
    const end = Math.min(text.length, at + 100);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }


  async search(q: string) {
    const query = (q ?? '').trim();
    if (!query) throw new BadRequestException('q is required');

    const rows = await Site.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' }, address: 1, title: 1, text: 1 },
    )
      .sort({ score: { $meta: 'textScore' } }) 
      .limit(20)
      .lean();

    return rows.map((r) => ({
      address: r.address,
      title: r.title,
      snippet: this.makeSnippet(r.text ?? '', query),
    }));
  }

}
