import { BadRequestException, Injectable } from '@nestjs/common';
import { Site } from '../schemas/site.model.js';
import mongoose from 'mongoose';
import { User } from '../schemas/user.model.js';
import { convert } from 'html-to-text';


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

  private extractText(html: string) {
    return convert(html, {
      wordwrap: false,
      selectors: [
        { selector: 'script', format: 'skip' },
        { selector: 'style', format: 'skip' },
        { selector: 'title', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } },
      ],
    })
      .replace(/\s+/g, ' ')
      .trim();
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

  async publish(body: { authorId: string; address: string; title: string; html: string }) {
    if (typeof body.address !== 'string' || !body.address.trim())
      throw new BadRequestException('address is required');

    const address = body.address.trim().toLowerCase();
    const title = (body.title ?? '').trim();
    const html = body.html ?? '';

    if (!title) throw new BadRequestException('Title is required');
    if (!html.trim()) throw new BadRequestException('HTML is required');
    if (!body.authorId || !mongoose.isValidObjectId(body.authorId))
      throw new BadRequestException('Valid author is required');

    const author = await User.exists({ _id: body.authorId });
    if (!author) throw new BadRequestException('Unknown author');

    const site = await Site.create({
      address,
      title,
      html,
      text: this.extractText(html),
      author: body.authorId,
    });

    return site

  }

}
