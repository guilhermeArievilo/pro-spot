import PageRepository from '../repository/page-repository';

export default class DeletePageUsecase {
  constructor(private repository: PageRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.deletePage(id);
  }
}
