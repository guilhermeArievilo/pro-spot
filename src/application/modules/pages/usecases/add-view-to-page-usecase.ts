import PageRepository from '../repository/page-repository';

export default class AddViewToPageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(slug: string): Promise<void> {
    await this.repository.addViewToPage(slug);
  }
}
