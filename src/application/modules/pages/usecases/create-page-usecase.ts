import { Page } from '@/application/entities';
import { PageSchema } from '../entities';
import PageRepository from '../repository/page-repository';
import { createSlug } from '@/lib/utils';

export default class CreatePageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(page: PageSchema, userId: string): Promise<Page> {
    const createdItem = await this.repository.createPage(
      {
        ...page,
        slug: createSlug(page?.name || '')
      },
      userId
    );
    return createdItem;
  }
}
