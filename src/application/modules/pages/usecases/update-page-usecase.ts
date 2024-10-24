import { Page } from '@/application/entities';
import { PageSchema } from '../entities';
import PageRepository from '../repository/page-repository';

export default class UpdatePageUsecase {
  constructor(private repository: PageRepository) {}

  async execute({ id, data }: { id: string; data: PageSchema }): Promise<Page> {
    const page = await this.repository.updatePage({
      id,
      data
    });

    return page;
  }
}
